
let productos = [];
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const contenedorProductos = document.getElementById("productos");
const contenedorCarrito = document.getElementById("carrito");
const btnVerCarrito = document.getElementById("verCarrito");
const cartCount = document.getElementById("cart-count");

btnVerCarrito.addEventListener("click", () => {
    contenedorCarrito.classList.toggle("oculto");
    mostrarCarrito();
});

fetch("./data/productos.json")
    .then(res => res.json())
    .then(data => {
        productos = data;
        renderProductos();
    });

function renderProductos() {
    const contenedorProductos = document.getElementById("productos");
    contenedorProductos.innerHTML = "";

    productos.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("col", "mb-4"); // Clave: Bootstrap espera columnas dentro de la fila
        div.innerHTML = `
            <div class="card h-100">
                <img src="./assets/zapas1.png" class="card-img-top" alt="Zapatilla">
                <div class="card-body d-flex flex-column justify-content-between">
                    <h5 class="card-title">${producto.nombre}</h5>
                    <p class="card-text">$${producto.precio}</p>
                    <button class="btn btn-dark mt-auto" onclick="agregarAlCarrito(${producto.id})">
                        Agregar al carrito
                    </button>
                </div>
            </div>
        `;

        contenedorProductos.appendChild(div);
    });
}


function agregarAlCarrito(id) {
    const item = productos.find(p => p.id === id);
    const itemEnCarrito = carrito.find(p => p.id === id);

    if (itemEnCarrito) {
        itemEnCarrito.cantidad++;
    } else {
        carrito.push({ ...item, cantidad: 1 });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContador();
    Swal.fire("Agregado!", `${item.nombre} fue agregado al carrito.`, "success");
}


function mostrarCarrito() {
    contenedorCarrito.innerHTML = "<h2>Carrito de compras</h2>";

    if (carrito.length === 0) {
        contenedorCarrito.innerHTML += "<p>El carrito está vacío.</p>";
        return;
    }

    carrito.forEach((item) => {
        const div = document.createElement("div");
        div.classList.add("d-flex", "justify-content-between", "align-items-center", "mb-2");
        div.innerHTML = `
            <span>${item.nombre} - $${item.precio} (x${item.cantidad})</span>
            <button class="btn btn-sm btn-outline-danger" onclick="eliminarDelCarrito(${item.id})">Eliminar</button>
        `;
        contenedorCarrito.appendChild(div);
    });

    const total = carrito.reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0);
    contenedorCarrito.innerHTML += `<h3>Total: $${total}</h3>`;
    contenedorCarrito.innerHTML += '<button class="btn btn-success" onclick="finalizarCompra()">Finalizar compra</button>';
}



function eliminarDelCarrito(id) {
    const itemIndex = carrito.findIndex(p => p.id === id);

    if (itemIndex !== -1) {
        if (carrito[itemIndex].cantidad > 1) {
            carrito[itemIndex].cantidad--;
        } else {
            carrito.splice(itemIndex, 1); 
        }
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
    actualizarContador();
}


function finalizarCompra() {
    if (carrito.length === 0) {
        Swal.fire({
            icon: "warning",
            title: "Carrito vacío",
            text: "No tienes productos en el carrito.",
            confirmButtonText: "Aceptar"
        });
        return;
    }

    Swal.fire({
        title: "¿Confirmar compra?",
        text: `Vas a comprar ${carrito.reduce((acc, item) => acc + item.cantidad, 0)} productos por un total de $${carrito.reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0)}`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#198754", // verde bootstrap
        cancelButtonColor: "#dc3545",  // rojo bootstrap
        confirmButtonText: "Sí, finalizar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                icon: "success",
                title: "¡Compra realizada!",
                text: "Gracias por tu pedido.",
                confirmButtonText: "Aceptar"
            });

            carrito = [];
            localStorage.removeItem("carrito");
            mostrarCarrito();
            actualizarContador();
        }
    });
}


function actualizarContador() {
    cartCount.textContent = carrito.length;
}

actualizarContador();
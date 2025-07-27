
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
    carrito.push(item);
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
    carrito.forEach((item, index) => {
        const div = document.createElement("div");
        div.innerHTML = `${item.nombre} - $${item.precio} <button class="btn btn-sm btn-outline-danger ms-2" onclick="eliminarDelCarrito(${index})">Eliminar</button>`;
        contenedorCarrito.appendChild(div);
    });
    const total = carrito.reduce((acc, prod) => acc + prod.precio, 0);
    contenedorCarrito.innerHTML += `<h3>Total: $${total}</h3>`;
    contenedorCarrito.innerHTML += '<button class="btn btn-success" onclick="finalizarCompra()">Finalizar compra</button>';
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
    actualizarContador();
}

function finalizarCompra() {
    Swal.fire("Gracias por tu compra!", "Tu pedido ha sido confirmado.", "success");
    carrito = [];
    localStorage.removeItem("carrito");
    mostrarCarrito();
    actualizarContador();
}

function actualizarContador() {
    cartCount.textContent = carrito.length;
}

actualizarContador();
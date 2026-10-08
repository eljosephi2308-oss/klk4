// ==========================================
// VARIABLES
// ==========================================

let carrito = [];

let usuario = null;

let categoriaActual = "todos";

let filtroActual = "todos";


// ==========================================
// ELEMENTOS
// ==========================================

const contadorCarrito =
    document.getElementById("contadorCarrito");

const listaCarrito =
    document.getElementById("listaCarrito");

const totalCarrito =
    document.getElementById("totalCarrito");

const modalCarrito =
    document.getElementById("modalCarrito");

const modalLogin =
    document.getElementById("modalLogin");

const modalRegistro =
    document.getElementById("modalRegistro");

const notificacion =
    document.getElementById("notificacion");

const buscador =
    document.getElementById("buscador");

const productos =
    document.querySelectorAll(".producto");


// ==========================================
// CARGAR DATOS
// ==========================================

try {

    carrito =
        JSON.parse(
            localStorage.getItem("carritoFortnite")
        ) || [];

    usuario =
        JSON.parse(
            localStorage.getItem("usuarioFortnite")
        ) || null;

} catch (error) {

    carrito = [];
    usuario = null;

}

actualizarCarrito();


// ==========================================
// AGREGAR AL CARRITO
// ==========================================

document.querySelectorAll(".btn-comprar").forEach(
    boton => {

        boton.addEventListener("click", () => {

            const nombre =
                boton.dataset.nombre;

            const precio =
                Number(boton.dataset.precio);

            agregarCarrito(nombre, precio);

        });

    }
);


function agregarCarrito(nombre, precio) {

    const productoExistente =
        carrito.find(
            producto => producto.nombre === nombre
        );

    if (productoExistente) {

        productoExistente.cantidad++;

    } else {

        carrito.push({
            nombre: nombre,
            precio: precio,
            cantidad: 1
        });

    }

    guardarCarrito();

    actualizarCarrito();

    mostrarNotificacion(
        "🛒 Producto agregado al carrito"
    );
}


// ==========================================
// GUARDAR CARRITO
// ==========================================

function guardarCarrito() {

    localStorage.setItem(
        "carritoFortnite",
        JSON.stringify(carrito)
    );

}


// ==========================================
// ACTUALIZAR CARRITO
// ==========================================

function actualizarCarrito() {

    let cantidadTotal = 0;

    let precioTotal = 0;

    carrito.forEach(producto => {

        cantidadTotal += producto.cantidad;

        precioTotal +=
            producto.precio *
            producto.cantidad;

    });

    contadorCarrito.textContent =
        cantidadTotal;

    totalCarrito.textContent =
        precioTotal.toLocaleString();

    renderizarCarrito();

}


// ==========================================
// MOSTRAR CARRITO
// ==========================================

function renderizarCarrito() {

    listaCarrito.innerHTML = "";

    if (carrito.length === 0) {

        listaCarrito.innerHTML = `
            <div class="carrito-vacio">
                🛒
                <br><br>
                Tu carrito está vacío.
            </div>
        `;

        return;
    }


    carrito.forEach((producto, indice) => {

        const elemento =
            document.createElement("div");

        elemento.classList.add("carrito-item");

        elemento.innerHTML = `

            <div class="carrito-item-info">

                <h4>
                    ${producto.nombre}
                </h4>

                <p>
                    ${producto.precio.toLocaleString()}
                    V-Bucks
                </p>

            </div>


            <div class="cantidad">

                <button
                    onclick="cambiarCantidad(${indice}, -1)"
                >
                    -
                </button>

                <span>
                    ${producto.cantidad}
                </span>

                <button
                    onclick="cambiarCantidad(${indice}, 1)"
                >
                    +
                </button>

            </div>


            <button
                class="cantidad eliminar"
                onclick="eliminarProducto(${indice})"
            >
                🗑️
            </button>

        `;

        listaCarrito.appendChild(elemento);

    });

}


// ==========================================
// CAMBIAR CANTIDAD
// ==========================================

function cambiarCantidad(indice, cambio) {

    carrito[indice].cantidad += cambio;

    if (carrito[indice].cantidad <= 0) {

        carrito.splice(indice, 1);

    }

    guardarCarrito();

    actualizarCarrito();

}


// ==========================================
// ELIMINAR PRODUCTO
// ==========================================

function eliminarProducto(indice) {

    carrito.splice(indice, 1);

    guardarCarrito();

    actualizarCarrito();

    mostrarNotificacion(
        "Producto eliminado"
    );

}


// ==========================================
// ABRIR CARRITO
// ==========================================

document
    .getElementById("btnCarrito")
    .addEventListener("click", () => {

        modalCarrito.classList.add("activo");

    });


// ==========================================
// CERRAR CARRITO
// ==========================================

document
    .getElementById("cerrarCarrito")
    .addEventListener("click", () => {

        modalCarrito.classList.remove("activo");

    });


// ==========================================
// CERRAR MODAL AL HACER CLICK AFUERA
// ==========================================

document
    .querySelectorAll(".modal")
    .forEach(modal => {

        modal.addEventListener("click", evento => {

            if (evento.target === modal) {

                modal.classList.remove("activo");

            }

        });

    });


// ==========================================
// FINALIZAR COMPRA
// ==========================================

document
    .getElementById("btnFinalizar")
    .addEventListener("click", () => {

        if (carrito.length === 0) {

            mostrarNotificacion(
                "🛒 Tu carrito está vacío"
            );

            return;

        }


        if (!usuario) {

            modalCarrito.classList.remove(
                "activo"
            );

            modalLogin.classList.add(
                "activo"
            );

            mostrarNotificacion(
                "🔐 Inicia sesión para continuar"
            );

            return;

        }


        carrito = [];

        guardarCarrito();

        actualizarCarrito();

        modalCarrito.classList.remove(
            "activo"
        );

        mostrarNotificacion(
            "✅ Compra simulada realizada"
        );

    });


// ==========================================
// FILTRO POR CATEGORIA
// ==========================================

document
    .querySelectorAll(".categoria")
    .forEach(boton => {

        boton.addEventListener("click", () => {

            document
                .querySelectorAll(".categoria")
                .forEach(btn =>
                    btn.classList.remove("activo")
                );

            boton.classList.add("activo");

            categoriaActual =
                boton.dataset.categoria;

            aplicarFiltros();

        });

    });


// ==========================================
// FILTRO POR PRECIO
// ==========================================

document
    .querySelectorAll(".filtro")
    .forEach(boton => {

        boton.addEventListener("click", () => {

            document
                .querySelectorAll(".filtro")
                .forEach(btn =>
                    btn.classList.remove("activo")
                );

            boton.classList.add("activo");

            filtroActual =
                boton.dataset.filtro;

            aplicarFiltros();

        });

    });


// ==========================================
// BUSCADOR
// ==========================================

buscador.addEventListener(
    "input",
    aplicarFiltros
);


function aplicarFiltros() {

    const texto =
        buscador.value
            .toLowerCase()
            .trim();


    productos.forEach(producto => {

        const nombre =
            producto.dataset.nombre
                .toLowerCase();

        const categoria =
            producto.dataset.categoria;

        const precio =
            Number(producto.dataset.precio);


        let mostrarCategoria =
            categoriaActual === "todos" ||
            categoria === categoriaActual;


        let mostrarPrecio = true;


        if (filtroActual === "barato") {

            mostrarPrecio = precio < 800;

        }


        if (filtroActual === "medio") {

            mostrarPrecio =
                precio >= 800 &&
                precio <= 1200;

        }


        if (filtroActual === "caro") {

            mostrarPrecio = precio > 1200;

        }


        const mostrarBusqueda =
            nombre.includes(texto);


        if (
            mostrarCategoria &&
            mostrarPrecio &&
            mostrarBusqueda
        ) {

            producto.style.display = "";

        } else {

            producto.style.display = "none";

        }

    });

}


// ==========================================
// FAVORITOS
// ==========================================

document
    .querySelectorAll(".favorito")
    .forEach(boton => {

        boton.addEventListener("click", () => {

            boton.classList.toggle("activo");

            if (
                boton.classList.contains("activo")
            ) {

                boton.textContent = "♥";

                mostrarNotificacion(
                    "❤️ Agregado a favoritos"
                );

            } else {

                boton.textContent = "♡";

                mostrarNotificacion(
                    "♡ Eliminado de favoritos"
                );

            }

        });

    });


// ==========================================
// LOGIN
// ==========================================

document
    .getElementById("btnLogin")
    .addEventListener("click", () => {

        if (usuario) {

            mostrarNotificacion(
                `👋 Hola ${usuario.nombre}`
            );

        } else {

            modalLogin.classList.add("activo");

        }

    });


// ==========================================
// CERRAR LOGIN
// ==========================================

document
    .getElementById("cerrarLogin")
    .addEventListener("click", () => {

        modalLogin.classList.remove(
            "activo"
        );

    });


// ==========================================
// IR A REGISTRO
// ==========================================

document
    .getElementById("irRegistro")
    .addEventListener("click", () => {

        modalLogin.classList.remove(
            "activo"
        );

        modalRegistro.classList.add(
            "activo"
        );

    });


// ==========================================
// IR A LOGIN
// ==========================================

document
    .getElementById("irLogin")
    .addEventListener("click", () => {

        modalRegistro.classList.remove(
            "activo"
        );

        modalLogin.classList.add(
            "activo"
        );

    });


// ==========================================
// CERRAR REGISTRO
// ==========================================

document
    .getElementById("cerrarRegistro")
    .addEventListener("click", () => {

        modalRegistro.classList.remove(
            "activo"
        );

    });


// ==========================================
// REGISTRO
// ==========================================

document
    .getElementById("formRegistro")
    .addEventListener("submit", evento => {

        evento.preventDefault();


        const nombre =
            document.getElementById("nombre")
                .value.trim();

        const email =
            document.getElementById("email")
                .value.trim();

        const password =
            document.getElementById("password")
                .value;


        if (password.length < 6) {

            mostrarNotificacion(
                "❌ La contraseña debe tener 6 caracteres"
            );

            return;

        }


        const nuevoUsuario = {

            nombre: nombre,
            email: email,
            password: password

        };


        localStorage.setItem(
            "usuarioFortnite",
            JSON.stringify(nuevoUsuario)
        );


        usuario = nuevoUsuario;


        modalRegistro.classList.remove(
            "activo"
        );


        document
            .getElementById("formRegistro")
            .reset();


        mostrarNotificacion(
            "✅ Cuenta creada correctamente"
        );

    });


// ==========================================
// LOGIN
// ==========================================

document
    .getElementById("formLogin")
    .addEventListener("submit", evento => {

        evento.preventDefault();


        const email =
            document.getElementById("loginEmail")
                .value.trim();

        const password =
            document.getElementById("loginPassword")
                .value;


        const usuarioGuardado =
            JSON.parse(
                localStorage.getItem(
                    "usuarioFortnite"
                )
            );


        if (!usuarioGuardado) {

            mostrarNotificacion(
                "❌ No existe una cuenta"
            );

            return;

        }


        if (
            usuarioGuardado.email === email &&
            usuarioGuardado.password === password
        ) {

            usuario = usuarioGuardado;


            modalLogin.classList.remove(
                "activo"
            );


            document
                .getElementById("formLogin")
                .reset();


            mostrarNotificacion(
                `👋 Bienvenido ${usuario.nombre}`
            );

        } else {

            mostrarNotificacion(
                "❌ Correo o contraseña incorrectos"
            );

        }

    });


// ==========================================
// NOTIFICACIONES
// ==========================================

let tiempoNotificacion;


function mostrarNotificacion(mensaje) {

    notificacion.textContent =
        mensaje;

    notificacion.classList.add(
        "mostrar"
    );


    clearTimeout(tiempoNotificacion);


    tiempoNotificacion =
        setTimeout(() => {

            notificacion.classList.remove(
                "mostrar"
            );

        }, 2500);

}


// ==========================================
// MENU MOVIL
// ==========================================

document
    .getElementById("menuBtn")
    .addEventListener("click", () => {

        document
            .getElementById("nav")
            .classList.toggle("activo");

    });


// ==========================================
// CERRAR MENU AL TOCAR UN LINK
// ==========================================

document
    .querySelectorAll(".nav a")
    .forEach(enlace => {

        enlace.addEventListener("click", () => {

            document
                .getElementById("nav")
                .classList.remove("activo");

        });

    });
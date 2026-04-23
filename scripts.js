// Menú móvil personalizado (cubos apilados animados)
document.addEventListener('DOMContentLoaded', function() {
	const btn = document.getElementById('menu-movil-btn');
	const nav = document.getElementById('nav-principal');
	if (!btn || !nav) return;
	btn.addEventListener('click', function() {
		nav.classList.toggle('nav-abierto');
		btn.classList.toggle('activo');
	});

	// Cierra el menú móvil al hacer click en cualquier link del nav
	const links = nav.querySelectorAll('a');
	links.forEach(function(link) {
		link.addEventListener('click', function() {
			nav.classList.remove('nav-abierto');
			btn.classList.remove('activo');
		});
	});
});
// --- Configuración de productos (puede cargarse desde JSON externo en el futuro) ---
// --- Configuración de productos (puede cargarse desde JSON externo en el futuro) ---
document.addEventListener('DOMContentLoaded', function() {
	// Aquí podrías cargar productos desde un JSON externo usando fetch, por ejemplo:
	// fetch('productos.json').then(r => r.json()).then(data => { productos = data; renderProductos(); });
});
let productos = [
	{
	nombre: 'Gancho Pantuflas',
	codigo: '001',
	imagen: 'images/WhatsApp Image 2026-01-23 at 14.51.19 (1).jpeg'
	},
	{
	nombre: 'Gancho Bóxer',
	codigo: '002',
	imagen: 'images/WhatsApp Image 2026-01-23 at 14.51.19 (2).jpeg'
	},
	{
	nombre: 'Gancho Pack x3',
	codigo: '003',
	imagen: 'images/WhatsApp Image 2026-01-23 at 14.51.19 (3).jpeg'
	},
	{
	nombre: 'Gancho Pack x3 Delgado',
	codigo: '004',
	imagen: 'images/WhatsApp Image 2026-01-23 at 14.51.19 (4).jpeg'
	},
	{
	nombre: 'Gancho Pack x1 Delgado',
	codigo: '005',
	imagen: 'images/WhatsApp Image 2026-01-23 at 14.51.19 (5).jpeg'
	},
	{
	nombre: 'Gancho Fundas Perchero',
	codigo: '006',
	imagen: 'images/WhatsApp Image 2026-01-23 at 14.51.20.jpeg'
	}
];

// Si quieres cargar productos desde un JSON externo:
// fetch('productos.json').then(r => r.json()).then(data => { productos = data; renderProductos(); });

const productosLista = document.getElementById('productos-lista');
const carritoLista = document.getElementById('carrito-lista');
const modalCarrito = document.getElementById('modal-carrito');
const modalCarritoBg = document.getElementById('modal-carrito-bg');
const modalCarritoContenido = document.getElementById('modal-carrito-contenido');
const cerrarModalCarrito = document.getElementById('cerrar-modal-carrito');
const procesarCarritoBtn = document.getElementById('procesar-carrito');
const modalFormulario = document.getElementById('modal-formulario');
const modalFormularioBg = document.getElementById('modal-formulario-bg');
const modalFormularioContenido = document.getElementById('modal-formulario-contenido');
const cerrarModalFormulario = document.getElementById('cerrar-modal-formulario');
const formEnvio = document.getElementById('form-envio');
const carritoIcono = document.getElementById('carrito-icono');
const carritoContador = document.getElementById('carrito-contador');

// --- Utilidades ---
function escapeHTML(str) {
       return String(str).replace(/[&<>"']/g, function (m) {
	       return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[m]);
       });
}

// --- Carrito en localStorage ---
function guardarCarrito() {
       localStorage.setItem('carrito', JSON.stringify(carrito));
}
function cargarCarrito() {
       const data = localStorage.getItem('carrito');
       if (data) {
	       try {
		       carrito = JSON.parse(data);
	       } catch(e) { carrito = []; }
       }
}

let carrito = [];
cargarCarrito();

// --- Renderizar productos ---
function renderProductos() {
       if (!productosLista) return;
       productosLista.innerHTML = '';
	       productos.forEach((prod, idx) => {
		       const card = document.createElement('div');
		       card.className = 'producto-card';
		       card.setAttribute('role', 'listitem');
		       let nombreHtml = `<h3>${escapeHTML(prod.nombre)}</h3>`;
		       if (prod.codigo) {
			       nombreHtml += `<div class="codigo-producto">Código ${escapeHTML(prod.codigo)}</div>`;
		       }
		       card.innerHTML = `
			       <img src="${escapeHTML(prod.imagen)}" alt="${escapeHTML(prod.nombre)}" loading="lazy">
			       ${nombreHtml}
			       <input type="number" class="cantidad" min="1" max="10" value="1" id="cantidad-${idx}" aria-label="Cantidad para ${escapeHTML(prod.nombre)}">
			       <button type="button" data-idx="${idx}" class="btn-agregar">Agregar</button>
		       `;
		       productosLista.appendChild(card);
	       });
       // Delegación de eventos para agregar
       productosLista.querySelectorAll('.btn-agregar').forEach(btn => {
	       btn.addEventListener('click', function() {
		       agregarAlCarrito(parseInt(this.getAttribute('data-idx')));
	       });
       });
}

function mostrarMensaje(texto, tipo = 'info') {
       let msg = document.createElement('div');
       msg.textContent = texto;
       msg.className = 'mensaje-flotante ' + (tipo === 'error' ? 'mensaje-error' : 'mensaje-info');
       document.body.appendChild(msg);
       setTimeout(() => { msg.remove(); }, 1800);
}

function agregarAlCarrito(idx) {
       const cantidadInput = document.getElementById(`cantidad-${idx}`);
       if (!cantidadInput) return;
       const cantidad = parseInt(cantidadInput.value);
       if (isNaN(cantidad) || cantidad < 1 || cantidad > 10) {
	       mostrarMensaje('Cantidad inválida', 'error');
	       return;
       }
       const prod = productos[idx];
       const existente = carrito.find(item => item.nombre === prod.nombre);
       if (existente) {
	       if (existente.cantidad + cantidad > 10) {
		       existente.cantidad = 10;
		       mostrarMensaje('Máximo 10 unidades por producto', 'error');
	       } else {
		       existente.cantidad += cantidad;
		       mostrarMensaje('Cantidad actualizada en el carrito', 'info');
	       }
       } else {
	       carrito.push({ ...prod, cantidad });
	       mostrarMensaje('Producto agregado al carrito', 'info');
       }
       guardarCarrito();
       renderCarrito();
       // Animar contador
       if (carritoContador) {
	   carritoContador.classList.remove('animar');
	   void carritoContador.offsetWidth;
	   carritoContador.classList.add('animar');
       }
}

function renderCarrito() {
       if (!carritoLista || !carritoContador || !procesarCarritoBtn) return;
       carritoLista.innerHTML = '';
       // Actualizar contador
       const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
       carritoContador.textContent = totalItems;
       if (carrito.length === 0) {
	       procesarCarritoBtn.style.display = 'none';
       } else {
	       procesarCarritoBtn.style.display = 'inline-block';
       }
       carrito.forEach((item, idx) => {
	       const div = document.createElement('div');
	       div.className = 'carrito-item';
	       div.innerHTML = `
		       <span>${escapeHTML(item.nombre)}</span>
		       <span>Cantidad: ${item.cantidad}</span>
		       <button type="button" onclick="eliminarDelCarrito(${idx})">Eliminar</button>
	       `;
	       carritoLista.appendChild(div);
       });
}

// --- Eventos para modales y formulario ---
if (carritoIcono && modalCarrito) {
       carritoIcono.addEventListener('click', () => {
	       renderCarrito();
	       modalCarrito.classList.add('activo');
	       modalCarrito.style.display = 'block';
	       document.body.style.overflow = 'hidden';
       });
}
if (carritoIcono && modalCarrito) {
       carritoIcono.addEventListener('keydown', (e) => {
	       if (e.key === 'Enter' || e.key === ' ') {
		       renderCarrito();
		       modalCarrito.classList.add('activo');
		       modalCarrito.style.display = 'block';
		       document.body.style.overflow = 'hidden';
	       }
       });
}
if (modalCarrito) {
       modalCarrito.addEventListener('click', function(e) {
	       if (e.target.classList.contains('cerrar-modal')) {
		       cerrarModal();
	       }
       });
}
if (modalCarritoBg) {
       modalCarritoBg.addEventListener('click', cerrarModal);
}
document.addEventListener('keydown', (e) => {
       if (modalCarrito && modalCarrito.classList.contains('activo') && (e.key === 'Escape' || e.key === 'Esc')) cerrarModal();
});

if (procesarCarritoBtn && modalFormulario) {
       procesarCarritoBtn.addEventListener('click', () => {
	       modalFormulario.classList.add('activo');
	       modalFormulario.style.display = 'block';
	       document.body.style.overflow = 'hidden';
       });
}
function cerrarModalForm() {
       if (!modalFormulario) return;
       modalFormulario.classList.remove('activo');
       modalFormulario.style.display = 'none';
       document.body.style.overflow = '';
}
if (cerrarModalFormulario) cerrarModalFormulario.addEventListener('click', cerrarModalForm);
if (modalFormularioBg) modalFormularioBg.addEventListener('click', cerrarModalForm);
document.addEventListener('keydown', (e) => {
       if (modalFormulario && modalFormulario.classList.contains('activo') && e.key === 'Escape') cerrarModalForm();
});
if (formEnvio) {
       formEnvio.addEventListener('submit', function(e) {
	       e.preventDefault();
	       const datos = Object.fromEntries(new FormData(formEnvio));
	       // Validación extra
	       if (!datos.nombre || !datos.apellido || !datos.telefono || !datos.correo || !datos.direccion || !datos.pago) {
		       mostrarMensaje('Por favor, completa todos los campos', 'error');
		       return;
	       }
	       // Validar email
	       if (!/^\S+@\S+\.\S+$/.test(datos.correo)) {
		       mostrarMensaje('Correo inválido', 'error');
		       return;
	       }
	       // Validar teléfono (simple)
	       if (!/^[0-9\s\-\+]{7,15}$/.test(datos.telefono)) {
		       mostrarMensaje('Teléfono inválido', 'error');
		       return;
	       }
	       if (carrito.length === 0) {
		       mostrarMensaje('El carrito está vacío', 'error');
		       return;
	       }
	       const productosMsg = carrito.map(item => `${escapeHTML(item.nombre)} x${item.cantidad}`).join('%0A');
	       const mensaje = `*Nuevo pedido Plast593*%0A%0A*Cliente:* ${escapeHTML(datos.nombre)} ${escapeHTML(datos.apellido)}%0A*Teléfono:* ${escapeHTML(datos.telefono)}%0A*Correo:* ${escapeHTML(datos.correo)}%0A*Dirección:* ${escapeHTML(datos.direccion)}%0A*Pago:* ${escapeHTML(datos.pago)}%0A%0A*Productos:*%0A${productosMsg}`;
	       const url = `https://wa.me/593962288611?text=${mensaje}`;
	       window.open(url, '_blank');
	       mostrarMensaje('Pedido enviado por WhatsApp', 'info');
	       // Limpiar carrito y formulario
	       carrito = [];
	       guardarCarrito();
	       renderCarrito();
	       formEnvio.reset();
	       cerrarModalForm();
       });
}

// Inicializar
renderProductos();
renderCarrito();


// Cerrar modal de carrito

function cerrarModal() {
	modalCarrito.classList.remove('activo');
	modalCarrito.style.display = 'none';
	document.body.style.overflow = '';
}
document.addEventListener('DOMContentLoaded', function() {
	// Delegación para cualquier botón .cerrar-modal dentro del modal-carrito
	if (modalCarrito) {
		modalCarrito.addEventListener('click', function(e) {
			if (e.target.classList.contains('cerrar-modal')) {
				cerrarModal();
			}
		});
	}
	if (modalCarritoBg) {
		modalCarritoBg.addEventListener('click', cerrarModal);
	}
	document.addEventListener('keydown', (e) => {
		if (modalCarrito && modalCarrito.classList.contains('activo') && (e.key === 'Escape' || e.key === 'Esc')) cerrarModal();
	});
});

function eliminarDelCarrito(idx) {
	carrito.splice(idx, 1);
	guardarCarrito();
	renderCarrito();
	mostrarMensaje('Producto eliminado', 'info');
}



procesarCarritoBtn.addEventListener('click', () => {
	modalFormulario.classList.add('activo');
	modalFormulario.style.display = 'block';
	document.body.style.overflow = 'hidden';
});


function cerrarModalForm() {
	modalFormulario.classList.remove('activo');
	modalFormulario.style.display = 'none';
	document.body.style.overflow = '';
}
cerrarModalFormulario.addEventListener('click', cerrarModalForm);
modalFormularioBg.addEventListener('click', cerrarModalForm);
document.addEventListener('keydown', (e) => {
	if (modalFormulario.classList.contains('activo') && e.key === 'Escape') cerrarModalForm();
});


formEnvio.addEventListener('submit', function(e) {
	e.preventDefault();
	const datos = Object.fromEntries(new FormData(formEnvio));
	// Validación extra
	if (!datos.nombre || !datos.apellido || !datos.telefono || !datos.correo || !datos.direccion || !datos.pago) {
		mostrarMensaje('Por favor, completa todos los campos', 'error');
		return;
	}
	// Validar email
	if (!/^\S+@\S+\.\S+$/.test(datos.correo)) {
		mostrarMensaje('Correo inválido', 'error');
		return;
	}
	// Validar teléfono (simple)
	if (!/^[0-9\s\-\+]{7,15}$/.test(datos.telefono)) {
		mostrarMensaje('Teléfono inválido', 'error');
		return;
	}
	if (carrito.length === 0) {
		mostrarMensaje('El carrito está vacío', 'error');
		return;
	}
	const productosMsg = carrito.map(item => `${escapeHTML(item.nombre)} x${item.cantidad}`).join('%0A');
	const mensaje = `*Nuevo pedido Plast593*%0A%0A*Cliente:* ${escapeHTML(datos.nombre)} ${escapeHTML(datos.apellido)}%0A*Teléfono:* ${escapeHTML(datos.telefono)}%0A*Correo:* ${escapeHTML(datos.correo)}%0A*Dirección:* ${escapeHTML(datos.direccion)}%0A*Pago:* ${escapeHTML(datos.pago)}%0A%0A*Productos:*%0A${productosMsg}`;
	const url = `https://wa.me/593962288611?text=${mensaje}`;
	window.open(url, '_blank');
	mostrarMensaje('Pedido enviado por WhatsApp', 'info');
	// Limpiar carrito y formulario
	carrito = [];
	guardarCarrito();
	renderCarrito();
	formEnvio.reset();
	cerrarModalForm();
});

// Inicializar
renderProductos();
renderCarrito();

// Animación de aparición para las cards de beneficios del banner
function animarBeneficioCardsBanner() {
    const cards = document.querySelectorAll('.beneficio-card');
    if (!cards.length) return;
    const observer = new window.IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.25 });
    cards.forEach(card => observer.observe(card));
}

document.addEventListener('DOMContentLoaded', function() {
    animarBeneficioCardsBanner();
});

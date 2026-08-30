// ==========================================================================
// GRIP Sneaker Store - data/productos.js
//
// Arreglo de productos (sneakers) de la tienda. En la Etapa 4 este arreglo
// se usa como referencia para "quemar" las tarjetas directamente en el
// HTML (index.html y pages/productos.html). En la Etapa 5, productos.js
// (dentro de /js) leerá este mismo arreglo y generará las tarjetas de
// forma dinámica con innerHTML/createElement, reemplazando el HTML fijo
// que dejamos ahora.
//
// Campos por producto (coinciden con el formulario de admin/producto-crear.html):
//   codigo        string  obligatorio, minimo 3 caracteres
//   nombre        string  obligatorio, maximo 100 caracteres
//   descripcion   string  opcional, maximo 500 caracteres
//   precio        number  obligatorio, >= 0, admite decimales
//   stock         number  obligatorio, entero >= 0
//   stockCritico  number  opcional, entero >= 0
//   categoria     string  una de: "urbano" | "running" | "basketball" | "skate"
//   imagen        string  ruta relativa a la imagen del producto
// ==========================================================================

const productos = [
  {
    codigo: "SNK-001",
    nombre: "GRIP Street 90",
    descripcion: "Zapatilla urbana de caña baja, silueta retro y entresuela acolchada para uso diario en la calle.",
    precio: 54990,
    stock: 18,
    stockCritico: 5,
    categoria: "urbano",
    imagen: "assets/img/producto-snk-001.svg"
  },
  {
    codigo: "SNK-002",
    nombre: "GRIP Runner X1",
    descripcion: "Zapatilla de running liviana, malla transpirable y mediasuela con retorno de energía.",
    precio: 64990,
    stock: 12,
    stockCritico: 4,
    categoria: "running",
    imagen: "assets/img/producto-snk-002.svg"
  },
  {
    codigo: "SNK-003",
    nombre: "GRIP Court Pro",
    descripcion: "Zapatilla de basketball de caña alta, soporte de tobillo reforzado y suela de alto agarre.",
    precio: 79990,
    stock: 3,
    stockCritico: 5,
    categoria: "basketball",
    imagen: "assets/img/producto-snk-003.svg"
  },
  {
    codigo: "SNK-004",
    nombre: "GRIP Slide Skate",
    descripcion: "Zapatilla de skate con puntera reforzada y suela plana de goma vulcanizada.",
    precio: 49990,
    stock: 25,
    stockCritico: 6,
    categoria: "skate",
    imagen: "assets/img/producto-snk-004.svg"
  },
  {
    codigo: "SNK-005",
    nombre: "GRIP Street Low",
    descripcion: "Versión de caña baja de nuestra línea urbana, minimalista y versátil para el día a día.",
    precio: 47990,
    stock: 20,
    stockCritico: 5,
    categoria: "urbano",
    imagen: "assets/img/producto-snk-005.svg"
  },
  {
    codigo: "SNK-006",
    nombre: "GRIP Velocity",
    descripcion: "Zapatilla de running de competencia, placa de estabilidad y peso reducido.",
    precio: 69990,
    stock: 9,
    stockCritico: 4,
    categoria: "running",
    imagen: "assets/img/producto-snk-006.svg"
  },
  {
    codigo: "SNK-007",
    nombre: "GRIP Baseline",
    descripcion: "Zapatilla de basketball de gama alta con amortiguación reactiva en el talón.",
    precio: 84990,
    stock: 14,
    stockCritico: 5,
    categoria: "basketball",
    imagen: "assets/img/producto-snk-007.svg"
  },
  {
    codigo: "SNK-008",
    nombre: "GRIP Grind Deck",
    descripcion: "Zapatilla de skate de perfil bajo, lengüeta acolchada y agarre optimizado para el deck.",
    precio: 52990,
    stock: 16,
    stockCritico: 5,
    categoria: "skate",
    imagen: "assets/img/producto-snk-008.svg"
  }
];

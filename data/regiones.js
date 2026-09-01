// ==========================================================================
// GRIP Sneaker Store - data/regiones.js
//
// Regiones de Chile y una selección de sus comunas más conocidas, usada
// por regiones-comunas.js para llenar dinámicamente el select de comuna
// según la región elegida (registro.html y admin/usuario-crear.html).
//
// IMPORTANTE: esta lista es REPRESENTATIVA, no exhaustiva (Chile tiene
// ~346 comunas en total). Incluye las comunas más conocidas de cada
// región para que la funcionalidad de "región -> comuna" se pueda
// demostrar completa en la Etapa 5. Si la rúbrica exige el listado 100%
// completo de comunas, se puede ampliar este arreglo más adelante sin
// tener que tocar nada de regiones-comunas.js.
//
// El campo "valor" de cada región coincide con el value= de las <option>
// que ya dejamos escritas a mano en registro.html y usuario-crear.html
// (Etapa 4), así que no hace falta regenerar ese select, solo el de comuna.
// ==========================================================================

const regiones = [
  { valor: 'arica-parinacota', nombre: 'Arica y Parinacota', comunas: ['Arica', 'Camarones', 'Putre', 'General Lagos'] },
  { valor: 'tarapaca', nombre: 'Tarapacá', comunas: ['Iquique', 'Alto Hospicio', 'Pozo Almonte', 'Pica', 'Huara', 'Camiña', 'Colchane'] },
  { valor: 'antofagasta', nombre: 'Antofagasta', comunas: ['Antofagasta', 'Calama', 'Tocopilla', 'Mejillones', 'San Pedro de Atacama', 'Taltal', 'María Elena'] },
  { valor: 'atacama', nombre: 'Atacama', comunas: ['Copiapó', 'Caldera', 'Vallenar', 'Chañaral', 'Diego de Almagro', 'Huasco', 'Freirina'] },
  { valor: 'coquimbo', nombre: 'Coquimbo', comunas: ['La Serena', 'Coquimbo', 'Ovalle', 'Illapel', 'Vicuña', 'Los Vilos', 'Combarbalá'] },
  { valor: 'valparaiso', nombre: 'Valparaíso', comunas: ['Valparaíso', 'Viña del Mar', 'Quilpué', 'Villa Alemana', 'San Antonio', 'Los Andes', 'Quillota', 'La Ligua', 'Isla de Pascua'] },
  { valor: 'metropolitana', nombre: 'Metropolitana de Santiago', comunas: ['Santiago', 'Providencia', 'Las Condes', 'Maipú', 'Puente Alto', 'La Florida', 'Ñuñoa', 'San Bernardo', 'Melipilla', 'Talagante'] },
  { valor: 'ohiggins', nombre: "Libertador General Bernardo O'Higgins", comunas: ['Rancagua', 'Rengo', 'San Fernando', 'Santa Cruz', 'Pichilemu', 'Machalí', 'Graneros'] },
  { valor: 'maule', nombre: 'Maule', comunas: ['Talca', 'Curicó', 'Linares', 'Cauquenes', 'Constitución', 'San Javier', 'Parral'] },
  { valor: 'nuble', nombre: 'Ñuble', comunas: ['Chillán', 'Chillán Viejo', 'San Carlos', 'Bulnes', 'Quirihue', 'Coihueco'] },
  { valor: 'biobio', nombre: 'Biobío', comunas: ['Concepción', 'Talcahuano', 'Los Ángeles', 'Coronel', 'Chiguayante', 'Arauco', 'Cañete', 'Lota'] },
  { valor: 'araucania', nombre: 'La Araucanía', comunas: ['Temuco', 'Villarrica', 'Pucón', 'Angol', 'Victoria', 'Nueva Imperial', 'Padre Las Casas'] },
  { valor: 'los-rios', nombre: 'Los Ríos', comunas: ['Valdivia', 'La Unión', 'Panguipulli', 'Río Bueno', 'Los Lagos', 'Paillaco'] },
  { valor: 'los-lagos', nombre: 'Los Lagos', comunas: ['Puerto Montt', 'Puerto Varas', 'Osorno', 'Castro', 'Ancud', 'Chonchi', 'Frutillar', 'Quellón'] },
  { valor: 'aysen', nombre: 'Aysén del General Carlos Ibáñez del Campo', comunas: ['Coyhaique', 'Puerto Aysén', 'Chile Chico', 'Cochrane', 'Puerto Cisnes'] },
  { valor: 'magallanes', nombre: 'Magallanes y de la Antártica Chilena', comunas: ['Punta Arenas', 'Puerto Natales', 'Porvenir', 'Cabo de Hornos', 'Timaukel'] },
];

// ==========================================================================
// GRIP Sneaker Store - data/usuarios.js
//
// Usuarios "semilla" de ejemplo, uno por cada rol, para poder probar el
// login y el panel administrativo sin depender de que alguien se haya
// registrado antes. login.js los usa para decidir con qué rol entra la
// sesión; admin-usuarios.js los combina con los registrados desde
// registro.html (guardados en localStorage) para listar TODOS los usuarios
// en el panel admin.
//
// Como no hay backend real, el "password" no se valida contra nada acá:
// cualquier contraseña de 4 a 10 caracteres funciona para iniciar sesión
// con cualquiera de estos correos (RNF-002, ya documentado como
// simulación en la ERS).
// ==========================================================================

const usuarios = [
  {
    run: '198765432',
    nombre: 'Ana',
    apellidos: 'Pérez',
    correo: 'ana.perez@duoc.cl',
    fechaNacimiento: '1990-05-12',
    tipoUsuario: 'administrador',
    region: 'valparaiso',
    comuna: 'valparaiso',
    direccion: 'Av. Errázuriz 1234',
  },
  {
    run: '176543210',
    nombre: 'Carlos',
    apellidos: 'Soto',
    correo: 'carlos.soto@duoc.cl',
    fechaNacimiento: '1995-08-20',
    tipoUsuario: 'vendedor',
    region: 'valparaiso',
    comuna: 'quilpue',
    direccion: 'Calle Los Aromos 456',
  },
  {
    run: '201234567',
    nombre: 'Valentina',
    apellidos: 'Muñoz',
    correo: 'valentina.munoz@gmail.com',
    fechaNacimiento: '1999-02-02',
    tipoUsuario: 'cliente',
    region: 'metropolitana',
    comuna: 'nunoa',
    direccion: 'Pasaje Las Rosas 789',
  },
];

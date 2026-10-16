import { usuariosService } from '../services/usuariosService'

const nuevo = {
  run: '123456785',
  nombre: ' Test ',
  apellidos: 'Usuario',
  correo: 'test@gmail.com',
  fechaNacimiento: '',
  region: 'metropolitana',
  comuna: 'Providencia',
  direccion: 'Calle 1',
}

describe('usuariosService', () => {
  it('registra un usuario con id correlativo, rol cliente y datos recortados', () => {
    const resultado = usuariosService.registrar(nuevo)

    expect(resultado.ok).toBeTrue()
    expect(resultado.registro.id).toBe('USR-004')
    expect(resultado.registro.tipoUsuario).toBe('cliente')
    expect(resultado.registro.nombre).toBe('Test')
  })

  it('rechaza correos y RUN duplicados', () => {
    usuariosService.registrar(nuevo)

    expect(usuariosService.registrar({ ...nuevo, run: '198765430' }).error).toContain('correo')
    expect(usuariosService.registrar({ ...nuevo, correo: 'otro@gmail.com' }).error).toContain('RUN')
  })

  it('busca por correo sin distinguir mayúsculas', () => {
    expect(usuariosService.buscarPorCorreo('ANA.PEREZ@duoc.cl').nombre).toBe('Ana')
    expect(usuariosService.buscarPorCorreo('nadie@gmail.com')).toBeNull()
  })
})

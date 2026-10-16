import {
  validarEmail,
  validarPassword,
  validarRUN,
  validarNumero,
  calcularDigitoVerificador,
} from '../utils/validaciones'

describe('validaciones', () => {
  describe('validarEmail', () => {
    it('acepta los dominios permitidos', () => {
      expect(validarEmail('ana@duoc.cl')).toBeNull()
      expect(validarEmail('ana@profesor.duoc.cl')).toBeNull()
      expect(validarEmail('ana@gmail.com')).toBeNull()
    })

    it('rechaza un dominio no permitido y un formato inválido', () => {
      expect(validarEmail('ana@hotmail.com')).toContain('Solo se aceptan')
      expect(validarEmail('sin-arroba')).toContain('formato válido')
      expect(validarEmail('')).toBe('El correo es obligatorio.')
    })
  })

  describe('validarRUN', () => {
    it('calcula el dígito verificador con el módulo 11', () => {
      expect(calcularDigitoVerificador('20123456')).toBe('5')
      expect(calcularDigitoVerificador('19876543')).toBe('0')
    })

    it('acepta un RUN con dígito verificador correcto y rechaza uno incorrecto', () => {
      expect(validarRUN('201234565')).toBeNull()
      expect(validarRUN('201234560')).toContain('dígito verificador')
    })

    it('rechaza RUN con puntos o guion', () => {
      expect(validarRUN('20.123.456-5')).toContain('sin puntos ni guion')
    })
  })

  describe('validarPassword y validarNumero', () => {
    it('exige entre 4 y 10 caracteres en la contraseña', () => {
      expect(validarPassword('abc')).toContain('entre 4 y 10')
      expect(validarPassword('abcd')).toBeNull()
      expect(validarPassword('12345678901')).toContain('entre 4 y 10')
    })

    it('valida números enteros y mínimos', () => {
      expect(validarNumero('-1', { min: 0, nombreCampo: 'El stock' })).toContain('mayor o igual a 0')
      expect(validarNumero('2.5', { entero: true, nombreCampo: 'El stock' })).toContain('entero')
      expect(validarNumero('10', { min: 0, entero: true })).toBeNull()
    })
  })
})

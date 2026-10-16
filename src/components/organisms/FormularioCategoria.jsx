import { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Boton from '../atoms/Boton'
import Mensaje from '../atoms/Mensaje'
import CampoFormulario from '../molecules/CampoFormulario'
import { useFormulario } from '../../hooks/useFormulario'
import { validarTexto } from '../../utils/validaciones'

const reglas = {
  nombre: (valor) => validarTexto(valor, { min: 3, max: 40, nombreCampo: 'El nombre' }),
  descripcion: (valor) => validarTexto(valor, { max: 200, nombreCampo: 'La descripción' }),
}

export default function FormularioCategoria({
  valoresIniciales = { nombre: '', descripcion: '' },
  onGuardar,
  onCancelar,
  textoBoton = 'Guardar categoría',
}) {
  const { valores, campo, validarTodo } = useFormulario(valoresIniciales, reglas)
  const [resultado, setResultado] = useState(null)

  function enviar(evento) {
    evento.preventDefault()
    setResultado(null)
    if (!validarTodo()) return
    setResultado(onGuardar({ nombre: valores.nombre.trim(), descripcion: valores.descripcion.trim() }))
  }

  return (
    <Form onSubmit={enviar} noValidate aria-label="Formulario de categoría">
      {resultado && !resultado.ok && <Mensaje variante="danger">{resultado.error}</Mensaje>}
      <CampoFormulario {...campo('nombre', 'categoria-nombre')} etiqueta="Nombre" />
      <CampoFormulario {...campo('descripcion', 'categoria-descripcion')} etiqueta="Descripción" tipo="textarea" filas={3} />
      <div className="d-flex gap-2 flex-wrap">
        <Boton tipo="submit">{textoBoton}</Boton>
        {onCancelar && <Boton variante="secundario" onClick={onCancelar}>Cancelar</Boton>}
      </div>
    </Form>
  )
}

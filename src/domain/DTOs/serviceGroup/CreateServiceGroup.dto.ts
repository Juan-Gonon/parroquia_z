/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

interface CreateGrupoServicioDtoBody {
  nombre: string
  descripcion?: string
  activo?: boolean
  idMinisterio: number
}

// Clase para el DTO de creación de GrupoServicio
export class CreateGrupoServicioDto {
  private constructor (
    public readonly nombre: string,
    public readonly idMinisterio: number,
    public readonly descripcion?: string,
    public readonly activo?: boolean
  ) {}

  static create (object: CreateGrupoServicioDtoBody): [string?, CreateGrupoServicioDto?] {
    const { nombre, descripcion, activo = true, idMinisterio } = object

    // Se valida que el nombre y el idMinisterio sean proporcionados y no estén vacíos
    if (!nombre) {
      return ['Missing name']
    }
    if (!idMinisterio) {
      return ['Missing idMinisterio']
    }
    if (isNaN(+idMinisterio)) {
      return ['The idMinisterio must be a number']
    }
    // Se retorna una nueva instancia del DTO
    return [undefined!, new CreateGrupoServicioDto(nombre, +idMinisterio, descripcion, activo)]
  }
}

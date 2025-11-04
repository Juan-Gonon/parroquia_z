/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

interface UpdateMinisterioDtoBody {
  id?: number
  nombre?: string
  descripcion?: string
  fechafundacion?: string
}

// Clase para el DTO de actualización de Ministerio
export class UpdateMinisterioDto {
  private constructor (
    public readonly id: number,
    public readonly nombre?: string,
    public readonly descripcion?: string,
    public readonly fechaFundacion?: Date
  ) {}

  get values (): { [key: string]: any } {
    const returnObject: { [key: string]: any } = {}
    if (this.nombre) returnObject.nombre = this.nombre
    if (this.descripcion) returnObject.descripcion = this.descripcion
    if (this.fechaFundacion) returnObject.fechafundacion = this.fechaFundacion
    return returnObject
  }

  static update (object: UpdateMinisterioDtoBody): [string?, UpdateMinisterioDto?] {
    const { id, nombre, descripcion, fechafundacion } = object

    // Se valida que se proporcione el ID y que sea un número válido
    if (!id || isNaN(+id)) {
      return ['Missing id']
    }

    // Se valida que al menos un campo esté presente para actualizar
    if (!nombre && !descripcion && !fechafundacion) {
      return ['Nothing to update']
    }

    // Se procesa la fecha de fundación si existe
    let foundationDate: Date | undefined
    if (fechafundacion) {
      foundationDate = new Date(fechafundacion)
      if (isNaN(foundationDate.getTime())) {
        return ['Invalid foundation date format']
      }
    }

    // Se retorna una nueva instancia del DTO con los campos a actualizar
    return [undefined!, new UpdateMinisterioDto(+id, nombre, descripcion, foundationDate)]
  }
}

/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

interface UpdateRolDentroMinisterioDtoBody {
  id?: number
  nombre?: string
  descripcion?: string
}

export class UpdateRolDentroMinisterioDto {
  private constructor (
    public readonly id: number,
    public readonly nombre?: string,
    public readonly descripcion?: string
  ) {}

  get values (): { [key: string]: any } {
    const returnObject: { [key: string]: any } = {}
    if (this.nombre) returnObject.nombre = this.nombre
    if (this.descripcion) returnObject.descripcion = this.descripcion
    return returnObject
  }

  static update (object: UpdateRolDentroMinisterioDtoBody): [string?, UpdateRolDentroMinisterioDto?] {
    const { id, nombre, descripcion } = object

    // Se valida que se proporcione el ID y que sea un número válido
    if (!id || isNaN(+id)) {
      return ['Missing id']
    }

    // Se valida que al menos un campo esté presente para actualizar
    if (!nombre && !descripcion) {
      return ['Nothing to update']
    }

    // Se retorna una nueva instancia del DTO con los campos a actualizar
    return [undefined!, new UpdateRolDentroMinisterioDto(+id, nombre, descripcion)]
  }
}

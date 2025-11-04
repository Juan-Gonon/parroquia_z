/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

interface UpdateRolPersonalDtoBody {
  id?: number
  nombre?: string
  descripcion?: string
  permisos?: string
}

export class UpdateRolPersonalDto {
  private constructor (
    public readonly id: number,
    public readonly nombre?: string,
    public readonly descripcion?: string,
    public readonly permisos?: string
  ) {}

  get values (): { [key: string]: any } {
    const returnObject: { [key: string]: any } = {}
    if (this.nombre) returnObject.nombre = this.nombre
    if (this.descripcion) returnObject.descripcion = this.descripcion
    if (this.permisos) returnObject.permisos = this.permisos
    return returnObject
  }

  static update (object: UpdateRolPersonalDtoBody): [string?, UpdateRolPersonalDto?] {
    const { id, nombre, descripcion, permisos } = object

    // Se valida que se proporcione el ID y que sea un número válido
    if (!id || isNaN(+id)) {
      return ['Missing id']
    }

    // Se valida que al menos un campo esté presente para actualizar
    if (!nombre && !descripcion && !permisos) {
      return ['Nothing to update']
    }

    // Se retorna una nueva instancia del DTO con los campos a actualizar
    return [undefined!, new UpdateRolPersonalDto(+id, nombre, descripcion, permisos)]
  }
}

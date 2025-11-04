/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

interface UpdatePersonalParroquialDtoBody {
  id?: number
  nombre?: string
  idRol?: string
  apellido?: string
  direccion?: string
  telefono?: string
  email?: string
}

export class UpdatePersonalParroquialDto {
  private constructor (
    public readonly id: number,
    public readonly nombre?: string,
    public readonly apellido?: string,
    public readonly idRol?: number,
    public readonly direccion?: string,
    public readonly telefono?: string,
    public readonly email?: string
  ) {}

  get values (): { [key: string]: any } {
    const returnObject: { [key: string]: any } = {}
    if (this.nombre) returnObject.nombre = this.nombre
    if (this.apellido) returnObject.apellido = this.apellido
    if (this.direccion) returnObject.direccion = this.direccion
    if (this.telefono) returnObject.telefono = this.telefono
    if (this.email) returnObject.email = this.email
    if (this.idRol) returnObject.id_rol = this.idRol
    return returnObject
  }

  static update (object: UpdatePersonalParroquialDtoBody): [string?, UpdatePersonalParroquialDto?] {
    const { id, nombre, apellido, idRol, direccion, telefono, email } = object

    // Se valida que se proporcione el ID y que sea un número válido
    if (!id || isNaN(+id)) {
      return ['Missing id']
    }

    if (idRol && isNaN(+idRol)) {
      return ['The idRol must be a number']
    }

    // Se valida que al menos un campo esté presente para actualizar
    if (!nombre && !apellido && !direccion && !telefono && !email && !idRol) {
      return ['Nothing to update']
    }

    // Se retorna una nueva instancia del DTO con los campos a actualizar
    return [undefined!, new UpdatePersonalParroquialDto(+id, nombre, apellido, +idRol!, direccion, telefono, email)]
  }
}

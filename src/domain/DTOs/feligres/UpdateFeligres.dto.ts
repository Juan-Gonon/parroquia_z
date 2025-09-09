/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

export interface UpdateFeligresDtoBody {
  id: number
  nombre?: string
  apellido?: string
  telefono?: string
  email?: string
}

export class UpdateFeligresDto {
  private constructor (
    public readonly id: number,
    public readonly nombre?: string,
    public readonly apellido?: string,
    public readonly telefono?: string,
    public readonly email?: string
  ) {}

  get values (): { [key: string]: any } {
    const returnObject: { [key: string]: any } = {}
    if (this.nombre !== undefined) returnObject.nombre = this.nombre
    if (this.apellido !== undefined) returnObject.apellido = this.apellido
    if (this.telefono !== undefined) returnObject.telefono = this.telefono
    if (this.email !== undefined) returnObject.email = this.email
    return returnObject
  }

  static update (object: UpdateFeligresDtoBody): [string?, UpdateFeligresDto?] {
    const { id, nombre, apellido, telefono, email } = object

    if (!id || isNaN(+id)) {
      return ['Missing id']
    }

    if (!nombre && !apellido && !telefono && !email) {
      return ['Nothing to update']
    }

    return [undefined!, new UpdateFeligresDto(+id, nombre, apellido, telefono, email)]
  }
}

/* eslint-disable no-return-assign */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

export class UpdateTipoTurnoDto {
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

  static update (object: {
    [key: string]: any
  }): [string?, UpdateTipoTurnoDto?] {
    const { id, nombre, descripcion } = object

    if (!id || isNaN(+id)) {
      return ['Missing id']
    }

    if (!nombre && !descripcion) {
      return ['Nothing to update']
    }

    return [undefined!, new UpdateTipoTurnoDto(+id, nombre, descripcion)]
  }
}

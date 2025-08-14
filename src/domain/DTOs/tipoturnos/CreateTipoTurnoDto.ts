/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

export class CreateTipoTurnoDto {
  private constructor (
    public readonly nombre: string,
    public readonly descripcion?: string
  ) {}

  static create (object: {
    [key: string]: any
  }): [string?, CreateTipoTurnoDto?] {
    const { nombre, descripcion } = object

    if (!nombre) {
      return ['Missing name']
    }

    return [undefined!, new CreateTipoTurnoDto(nombre, descripcion)]
  }
}

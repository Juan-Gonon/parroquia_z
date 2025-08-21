/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

interface CreateRolDentroMinisterioDtoBody {
  nombre: string
  descripcion?: string
}

export class CreateRolDentroMinisterioDto {
  private constructor (
    public readonly nombre: string,
    public readonly descripcion?: string
  ) {}

  static create (object: CreateRolDentroMinisterioDtoBody): [string?, CreateRolDentroMinisterioDto?] {
    const { nombre, descripcion } = object

    // Se valida que el nombre sea proporcionado y no esté vacío
    if (!nombre) {
      return ['Missing name']
    }
    // Se retorna una nueva instancia del DTO
    return [undefined!, new CreateRolDentroMinisterioDto(nombre, descripcion)]
  }
}

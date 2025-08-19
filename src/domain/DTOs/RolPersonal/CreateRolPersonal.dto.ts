/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
interface CreateRolPersonalDtoBody {
  nombre: string
  descripcion?: string
  permisos?: string
}

export class CreateRolPersonalDto {
  private constructor (
    public readonly nombre: string,
    public readonly descripcion?: string,
    public readonly permisos?: string
  ) {}

  static create (object: CreateRolPersonalDtoBody): [string?, CreateRolPersonalDto?] {
    const { nombre, descripcion, permisos } = object

    // Se valida que el nombre sea proporcionado y no esté vacío
    if (!nombre) {
      return ['Missing name']
    }
    // Se retorna una nueva instancia del DTO
    return [undefined!, new CreateRolPersonalDto(nombre, descripcion, permisos)]
  }
}

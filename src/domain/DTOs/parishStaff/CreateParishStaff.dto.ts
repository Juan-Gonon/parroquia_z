/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

interface CreatePersonalParroquialDtoBody {
  nombre: string
  apellido: string
  direccion?: string
  telefono?: string
  email?: string
}

export class CreatePersonalParroquialDto {
  private constructor (
    public readonly nombre: string,
    public readonly apellido: string,
    public readonly direccion?: string,
    public readonly telefono?: string,
    public readonly email?: string
  ) {}

  static create (object: CreatePersonalParroquialDtoBody): [string?, CreatePersonalParroquialDto?] {
    const { nombre, apellido, direccion, telefono, email } = object

    // Se valida que el nombre y el apellido sean proporcionados y no estén vacíos
    if (!nombre) {
      return ['Missing name']
    }
    if (!apellido) {
      return ['Missing last name']
    }

    // Se retorna una nueva instancia del DTO
    return [undefined!, new CreatePersonalParroquialDto(nombre, apellido, direccion, telefono, email)]
  }
}

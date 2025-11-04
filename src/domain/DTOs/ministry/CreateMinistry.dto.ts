/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

// Define la interfaz para el DTO de creación
interface CreateMinisterioDtoBody {
  nombre: string
  descripcion?: string
  fechafundacion?: string
}

// Clase para el DTO de creación de Ministerio
export class CreateMinisterioDto {
  private constructor (
    public readonly nombre: string,
    public readonly descripcion?: string,
    public readonly fechaFundacion?: Date
  ) {}

  static create (object: CreateMinisterioDtoBody): [string?, CreateMinisterioDto?] {
    const { nombre, descripcion, fechafundacion } = object

    // Se valida que el nombre sea proporcionado y no esté vacío
    if (!nombre) {
      return ['Missing name']
    }

    // Se procesa la fecha de fundación si existe
    let foundationDate: Date | undefined
    if (fechafundacion) {
      foundationDate = new Date(fechafundacion)
      if (isNaN(foundationDate.getTime())) {
        return ['Invalid foundation date format']
      }
    }

    // Se retorna una nueva instancia del DTO
    return [undefined!, new CreateMinisterioDto(nombre, descripcion, foundationDate)]
  }
}

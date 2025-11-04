/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

// Define la interfaz para el DTO de creación
interface CreateTipoIntencionDtoBody {
  nombre: string
  descripcion?: string
}

// Clase para el DTO de creación de TipoIntencion
export class CreateTipoIntencionDto {
  private constructor (
    public readonly nombre: string,
    public readonly descripcion?: string
  ) {}

  static create (object: CreateTipoIntencionDtoBody): [string?, CreateTipoIntencionDto?] {
    const { nombre, descripcion } = object

    // Se valida que el nombre sea proporcionado y no esté vacío
    if (!nombre) {
      return ['Missing name']
    }
    // Se retorna una nueva instancia del DTO
    return [undefined!, new CreateTipoIntencionDto(nombre, descripcion)]
  }
}

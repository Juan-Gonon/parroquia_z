/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

interface CreateEventoDtoBody {
  nombre: string
  fechaIni: string
  fechaFin?: string | null
  descripcion?: string
  idComunidad: number
  idTipoEvento: number
  aceptaIntenciones?: boolean
  requiereInscripcion?: boolean
  idCelebrante?: number
  nombreCelebranteExterno?: string
}

// Clase para el DTO de creación de Evento
export class CreateEventoDto {
  private constructor (
    public readonly nombre: string,
    public readonly fechaIni: Date,
    public readonly idComunidad: number,
    public readonly idTipoEvento: number,
    public readonly fechaFin?: Date | null,
    public readonly descripcion?: string,
    public readonly aceptaIntenciones?: boolean,
    public readonly requiereInscripcion?: boolean,
    public readonly idCelebrante?: number,
    public readonly nombreCelebranteExterno?: string
  ) {}

  static create (object: CreateEventoDtoBody): [string?, CreateEventoDto?] {
    const {
      nombre,
      fechaIni,
      fechaFin,
      descripcion,
      idComunidad,
      idTipoEvento,
      aceptaIntenciones,
      requiereInscripcion,
      idCelebrante,
      nombreCelebranteExterno
    } = object

    // Se valida que los campos requeridos estén presentes
    if (!nombre) return ['Missing nombre']
    if (!fechaIni) return ['Missing fechaIni']
    if (!idComunidad) return ['Missing idComunidad']
    if (!idTipoEvento) return ['Missing idTipoEvento']

    // Se valida la lógica del celebrante: uno debe ser proporcionado y el otro no.
    if ((idCelebrante && nombreCelebranteExterno) || (!idCelebrante && !nombreCelebranteExterno)) {
      return ['Exactly one of idCelebrante or nombreCelebranteExterno must be provided.']
    }

    // Validar las fechas
    const fechaIniObj = new Date(fechaIni)
    const fechaFinObj = fechaFin ? new Date(fechaFin) : null
    if (fechaFinObj && fechaIniObj > fechaFinObj) {
      return ['fechaIni cannot be after fechaFin']
    }

    // Se retorna una nueva instancia del DTO
    return [
      undefined!,
      new CreateEventoDto(
        nombre,
        fechaIniObj,
        +idComunidad,
        +idTipoEvento,
        fechaFinObj ?? null,
        descripcion,
        aceptaIntenciones,
        requiereInscripcion,
        idCelebrante ? +idCelebrante : undefined,
        nombreCelebranteExterno
      )
    ]
  }
}

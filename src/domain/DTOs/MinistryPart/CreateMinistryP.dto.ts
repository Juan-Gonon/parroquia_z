/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

interface CreateParticipacionDtoBody {
  idPersonal: number
  idMinisterio: number
  idRol: number
  fechaIni: string
  fechaFin?: string
  activo?: boolean
}

export class CreateParticipacionDto {
  private constructor (
    public readonly idPersonal: number,
    public readonly idMinisterio: number,
    public readonly idRol: number,
    public readonly fechaIniP: Date,
    public readonly fechaFinP?: Date | null,
    public readonly activo?: boolean
  ) {}

  static create (object: CreateParticipacionDtoBody): [string?, CreateParticipacionDto?] {
    const {
      idPersonal,
      idMinisterio,
      idRol,
      fechaIni,
      fechaFin,
      activo
    } = object

    console.log(object)

    // Se valida que los campos requeridos estén presentes
    if (!idPersonal) return ['Missing idPersonal']
    if (!idMinisterio) return ['Missing idMinisterio']
    if (!idRol) return ['Missing idRol']
    if (!fechaIni) return ['Missing fechaIni']

    // Validar las fechas
    const fechaIniP = new Date(fechaIni)
    const fechaFinP = fechaFin ? new Date(fechaFin) : null
    if (fechaFinP && fechaIniP > fechaFinP) {
      return ['fechaIni cannot be after fechaFin']
    }

    // Se retorna una nueva instancia del DTO
    return [
      undefined!,
      new CreateParticipacionDto(
        +idPersonal,
        +idMinisterio,
        +idRol,
        fechaIniP,
        fechaFinP,
        activo
      )
    ]
  }
}

/* eslint-disable curly */
/* eslint-disable @typescript-eslint/comma-dangle */
/* eslint-disable @typescript-eslint/space-before-function-paren */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

export interface CreateLiderComunitarioDtoBody {
  idPersonal: number
  idComunidad: number
  rolliderazgo: string
  fechaIni: string
  fechaFin?: string
  activo?: boolean
}

export class CreateLiderComunitarioDto {
  private constructor(
    public readonly idPersonal: number,
    public readonly idComunidad: number,
    public readonly rolliderazgo: string,
    public readonly fechaIni: Date,
    public readonly fechaFin?: Date | null,
    public readonly activo?: boolean
  ) {}

  static create(
    object: CreateLiderComunitarioDtoBody
  ): [string?, CreateLiderComunitarioDto?] {
    const {
      idPersonal,
      idComunidad,
      rolliderazgo,
      fechaIni,
      fechaFin,
      activo,
    } = object
    const errors: string[] = []

    // Validar campos obligatorios
    if (idPersonal === undefined || idPersonal === null)
      return ['id_personal is requerid']
    if (idComunidad === undefined || idComunidad === null)
      return ['id_comunidad is requerid']
    if (!rolliderazgo) return ['The rolliderazgo is required']
    if (!fechaIni) return ['Fecha is requerid']

    // Validar fechas
    const fechaIniP = new Date(fechaIni)
    const fechaFinP = fechaFin ? new Date(fechaFin) : null
    if (fechaFinP && fechaIniP > fechaFinP) {
      errors.push('fecha_ini cannot be after fecha_fin')
    }

    if (errors.length > 0) {
      return [errors.join(', ')]
    }

    return [
      undefined!,
      new CreateLiderComunitarioDto(
        +idPersonal,
        +idComunidad,
        rolliderazgo,
        fechaIniP,
        fechaFinP,
        activo
      ),
    ]
  }
}

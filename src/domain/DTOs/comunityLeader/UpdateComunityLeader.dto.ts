/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

export interface UpdateLiderComunitarioDtoBody {
  id: number
  idPersonal?: number
  idComunidad?: number
  rolliderazgo?: string
  fechaIni?: string
  fechaFin?: string
  activo?: boolean
}

export class UpdateLiderComunitarioDto {
  private constructor (
    public readonly id: number,
    public readonly idPersonal?: number,
    public readonly idComunidad?: number,
    public readonly rolliderazgo?: string,
    public readonly fechaIni?: Date,
    public readonly fechaFin?: Date,
    public readonly activo?: boolean
  ) {}

  get values (): { [key: string]: any } {
    const returnObject: { [key: string]: any } = {}
    if (this.idPersonal !== undefined) returnObject.id_personal = this.idPersonal
    if (this.idComunidad !== undefined) returnObject.id_comunidad = this.idComunidad
    if (this.rolliderazgo !== undefined) returnObject.rolliderazgo = this.rolliderazgo
    if (this.fechaIni !== undefined) returnObject.fecha_ini = this.fechaIni
    if (this.fechaFin !== undefined) returnObject.fecha_fin = this.fechaFin
    if (this.activo !== undefined) returnObject.activo = this.activo
    return returnObject
  }

  static update (object: UpdateLiderComunitarioDtoBody): [string?, UpdateLiderComunitarioDto?] {
    const { id, idPersonal, idComunidad, rolliderazgo, fechaIni, fechaFin, activo } = object

    if (!id || isNaN(+id)) {
      return ['Missing id']
    }

    // Se valida que al menos un campo esté presente para actualizar
    if (!idPersonal && !idComunidad && !rolliderazgo && !fechaIni && !fechaFin && activo === undefined) {
      return ['Nothing to update']
    }

    // Validar fechas
    const fechaIniP = fechaIni ? new Date(fechaIni) : undefined
    const fechaFinP = fechaFin ? new Date(fechaFin) : undefined
    if (fechaIniP && fechaFinP && fechaIniP > fechaFinP) {
      return ['fecha_ini cannot be after fecha_fin']
    }

    return [undefined!, new UpdateLiderComunitarioDto(+id, idPersonal, idComunidad, rolliderazgo, fechaIniP, fechaFinP, activo)]
  }
}

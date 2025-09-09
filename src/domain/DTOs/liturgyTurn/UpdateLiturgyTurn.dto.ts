/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

export interface UpdateTurnoLiturgicoComunitarioDtoBody {
  id: number
  idComunidad?: number
  idTipoTurno?: number
  fechaIni?: string
  fechaFin?: string
  descripcion?: string
}

export class UpdateTurnoLiturgicoComunitarioDto {
  private constructor (
    public readonly id: number,
    public readonly idComunidad?: number,
    public readonly idTipoTurno?: number,
    public readonly fechaIni?: Date,
    public readonly fechaFin?: Date,
    public readonly descripcion?: string
  ) {}

  get values (): { [key: string]: any } {
    const returnObject: { [key: string]: any } = {}
    if (this.idComunidad !== undefined) returnObject.id_comunidad = this.idComunidad
    if (this.idTipoTurno !== undefined) returnObject.id_tipo = this.idTipoTurno
    if (this.fechaIni !== undefined) returnObject.fecha_inicio = this.fechaIni
    if (this.fechaFin !== undefined) returnObject.fecha_fin = this.fechaFin
    if (this.descripcion !== undefined) returnObject.descripcion = this.descripcion
    return returnObject
  }

  static update (object: UpdateTurnoLiturgicoComunitarioDtoBody): [string?, UpdateTurnoLiturgicoComunitarioDto?] {
    const { id, idComunidad, idTipoTurno, fechaIni, fechaFin, descripcion } = object

    // Se valida que se proporcione el ID y que sea un número válido
    if (!id || isNaN(+id)) {
      return ['Missing id']
    }

    // Se valida que al menos un campo esté presente para actualizar
    if (!idComunidad && !idTipoTurno && !fechaIni && !fechaFin && !descripcion) {
      return ['Nothing to update']
    }

    // Validar fechas
    const fechaInicioP = fechaIni ? new Date(fechaIni) : undefined
    const fechaFinP = fechaFin ? new Date(fechaFin) : undefined
    if (fechaInicioP && fechaFinP && fechaInicioP > fechaFinP) return ['fecha_inicio cannot be after fecha_fin']

    return [undefined!, new UpdateTurnoLiturgicoComunitarioDto(+id, idComunidad, idTipoTurno, fechaInicioP, fechaFinP, descripcion)]
  }
}

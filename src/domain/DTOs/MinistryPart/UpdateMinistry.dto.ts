/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

interface UpdateParticipacionDtoBody {
  id?: number
  idPersonal?: number
  idMinisterio?: number
  idRol?: number
  fechaIni?: string
  fechaFin?: string
  activo?: boolean
}

export class UpdateParticipacionDto {
  private constructor (
    public readonly id: number,
    public readonly idPersonal?: number,
    public readonly idMinisterio?: number,
    public readonly idRol?: number,
    public readonly fechaIniPart?: Date | null,
    public readonly fechaFinPart?: Date | null,
    public readonly activo?: boolean
  ) {}

  get values (): { [key: string]: any } {
    const returnObject: { [key: string]: any } = {}
    if (this.idPersonal) returnObject.id_personal = this.idPersonal
    if (this.idMinisterio) returnObject.id_ministerio = this.idMinisterio
    if (this.idRol) returnObject.id_roldentroministerio = this.idRol
    if (this.fechaIniPart) returnObject.fecha_ini_part = this.fechaIniPart
    if (this.fechaFinPart) returnObject.fecha_fin_part = this.fechaFinPart
    if (this.activo !== undefined) returnObject.activo = this.activo
    return returnObject
  }

  static update (object: UpdateParticipacionDtoBody): [string?, UpdateParticipacionDto?] {
    const {
      id,
      idPersonal,
      idMinisterio,
      idRol,
      fechaIni,
      fechaFin,
      activo
    } = object

    // Se valida que se proporcione el ID y que sea un número válido
    if (!id || isNaN(+id)) {
      return ['Missing id']
    }

    // Se valida que al menos un campo esté presente para actualizar
    if (!idPersonal && !idMinisterio && !idRol && !fechaIni && !fechaFin && activo === undefined) {
      return ['Nothing to update']
    }

    // Validar las fechas
    const fechaIniPart = fechaIni ? new Date(fechaIni) : null
    const fechaFinPart = fechaFin ? new Date(fechaFin) : null
    if (fechaIniPart && fechaFin && fechaFinPart !== null && fechaIniPart > fechaFinPart) {
      return ['fechaIniPart cannot be after fechaFinPart']
    }

    // Se retorna una nueva instancia del DTO con los campos a actualizar
    return [
      undefined!,
      new UpdateParticipacionDto(
        +id,
        idPersonal ? +idPersonal : undefined,
        idMinisterio ? +idMinisterio : undefined,
        idRol ? +idRol : undefined,
        fechaIniPart,
        fechaFinPart,
        activo
      )
    ]
  }
}

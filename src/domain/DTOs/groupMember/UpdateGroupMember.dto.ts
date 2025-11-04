/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

interface UpdateMiembroGrupoDtoBody {
  id: number
  idPartMin?: number
  idGrupoServicio?: number
  fechaIni?: Date
  fechaFin?: Date
  roldentrogrupo?: string
  activo?: boolean
}

export class UpdateMiembroGrupoDto {
  private constructor (
    public readonly id: number,
    public readonly idPartMin?: number,
    public readonly idGrupoServicio?: number,
    public readonly fechaIni?: Date,
    public readonly fechaFin?: Date,
    public readonly roldentrogrupo?: string,
    public readonly activo?: boolean
  ) {}

  get values (): { [key: string]: UpdateMiembroGrupoDtoBody } {
    const returnObject: { [key: string]: any } = {}
    if (this.idPartMin) returnObject.id_part_min = this.idPartMin
    if (this.idGrupoServicio) returnObject.id_gruposervicio = this.idGrupoServicio
    if (this.fechaIni) returnObject.fecha_ini_msia = new Date(this.fechaIni)
    if (this.fechaFin) returnObject.fecha_fin_msia = new Date(this.fechaFin)
    if (this.roldentrogrupo) returnObject.roldentrogrupo = this.roldentrogrupo
    if (this.activo !== undefined) returnObject.activo = this.activo
    return returnObject
  }

  static update (object: UpdateMiembroGrupoDtoBody): [string?, UpdateMiembroGrupoDto?] {
    const { id, idPartMin, idGrupoServicio, fechaIni, fechaFin, roldentrogrupo, activo } = object

    // Se valida que se proporcione el ID y que sea un número válido
    if (!id || isNaN(+id)) {
      return ['Missing id']
    }

    // Se valida que al menos un campo esté presente para actualizar
    if (!idPartMin && !idGrupoServicio && !fechaIni && !fechaFin && !roldentrogrupo && activo === undefined) {
      return ['Nothing to update']
    }

    // Se valida el formato de los campos opcionales si están presentes
    if (idPartMin && isNaN(+idPartMin)) {
      return ['The idPartMin is not a number']
    }
    if (idGrupoServicio && isNaN(+idGrupoServicio)) {
      return ['The idGrupoServicio is not a number']
    }
    if (roldentrogrupo && typeof roldentrogrupo !== 'string') {
      return ['The rolDentroGrupo is not a string']
    }
    if (activo !== undefined && typeof activo !== 'boolean') {
      return ['The activo is not a boolean']
    }

    return [undefined!, new UpdateMiembroGrupoDto(+id, idPartMin, idGrupoServicio, fechaIni, fechaFin, roldentrogrupo, activo)]
  }
}

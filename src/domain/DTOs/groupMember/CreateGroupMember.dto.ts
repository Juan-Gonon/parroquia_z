/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

interface CreateMiembroGrupoDtoBody {
  idPartMin: number
  idGrupoServicio: number
  fechaIni: Date
  fechaFin?: Date
  roldentrogrupo: string
  activo?: boolean
}

// Clase para el DTO de creación de MiembroGrupo
export class CreateMiembroGrupoDto {
  private constructor (
    public readonly idPartMin: number,
    public readonly idGrupoServicio: number,
    public readonly fechaIni: Date,
    public readonly roldentrogrupo: string,
    public readonly fechaFin?: Date | null,
    public readonly activo?: boolean
  ) {}

  static create (object: CreateMiembroGrupoDtoBody): [string?, CreateMiembroGrupoDto?] {
    const { idPartMin, idGrupoServicio, fechaIni, fechaFin, roldentrogrupo, activo } = object

    // Validar campos obligatorios
    if (!idPartMin) {
      return ['Missing idPartMin']
    }
    if (!idGrupoServicio) {
      return ['Missing idGrupoServicio']
    }
    if (!fechaIni) {
      return ['Missing fechaIniMsia']
    }
    if (!roldentrogrupo) {
      return ['Missing rolDentroGrupo']
    }

    // Validar tipo de datos
    if (isNaN(+idPartMin)) {
      return ['The idPartMin is not a number']
    }
    if (isNaN(+idGrupoServicio)) {
      return ['The idGrupoServicio is not a number']
    }
    if (typeof roldentrogrupo !== 'string') {
      return ['The rolDentroGrupo is not a string']
    }
    if (activo && typeof activo !== 'boolean') {
      return ['The activo is not a boolean']
    }

    // Validar las fechas
    const fechaIniP = new Date(fechaIni)
    const fechaFinP = fechaFin ? new Date(fechaFin) : null
    if (fechaFinP && fechaIniP > fechaFinP) {
      return ['fechaIni cannot be after fechaFin']
    }

    return [undefined!, new CreateMiembroGrupoDto(+idPartMin, +idGrupoServicio, fechaIniP, roldentrogrupo, fechaFinP, activo)]
  }
}

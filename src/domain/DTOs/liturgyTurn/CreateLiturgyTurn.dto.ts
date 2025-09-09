/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { validationMessages } from '../../../constants/validationMessage.c'

export interface CreateTurnoLiturgicoComunitarioDtoBody {
  idComunidad: number
  idTipoTurno: number
  fechaIni: string
  descripcion?: string
  fechaFin?: string
}

export class CreateTurnoLiturgicoComunitarioDto {
  private constructor (
    public readonly idComunidad: number,
    public readonly idTipoTurno: number,
    public readonly fechaIni: Date,
    public readonly descripcion?: string,
    public readonly fechaFin?: Date | null
  ) {}

  static create (object: CreateTurnoLiturgicoComunitarioDtoBody): [string?, CreateTurnoLiturgicoComunitarioDto?] {
    const { idComunidad, idTipoTurno, fechaIni, fechaFin, descripcion } = object

    // Validar campos obligatorios
    if (idComunidad === undefined || idComunidad === null) return [`${validationMessages.required('id_comunidad')}`]
    if (idTipoTurno === undefined || idTipoTurno === null) return [`${validationMessages.required('id_tipo')}`]
    if (!fechaIni) return [`${validationMessages.required('fecha_inicio')}`]
    // if (!descripcion || descripcion === undefined) return [`${validationMessages.required('descripcion')}`]

    // Validar fechas
    const fechaInicioP = new Date(fechaIni)
    const fechaFinP = fechaFin ? new Date(fechaFin) : null
    if (fechaFinP && fechaInicioP > fechaFinP) {
      return ['fecha_inicio cannot be after fecha_fin']
    }

    return [undefined!, new CreateTurnoLiturgicoComunitarioDto(
      idComunidad,
      idTipoTurno,
      fechaInicioP,
      descripcion,
      fechaFinP
    )]
  }
}

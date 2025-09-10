/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { validationMessages } from '../../../constants/validationMessage.c'

export interface CreateIntencionDtoBody {
  idFeligres: number
  idEvento: number
  idTipoIntencion: number
  idEstadoIntencion: number
  descripcion: string
  montoOfrenda?: number
  pagada?: boolean
  montoPagado?: number
  fechaPago?: string
}

export class CreateIntencionDto {
  private constructor (
    public readonly idFeligres: number,
    public readonly idEvento: number,
    public readonly idTipoIntencion: number,
    public readonly idEstadoIntencion: number,
    public readonly descripcion: string,
    public readonly montoOfrenda?: number,
    public readonly pagada?: boolean,
    public readonly montoPagado?: number,
    public readonly fechaPago?: Date | null
  ) {}

  static create (object: CreateIntencionDtoBody): [string?, CreateIntencionDto?] {
    const {
      idFeligres,
      idEvento,
      idTipoIntencion,
      idEstadoIntencion,
      descripcion,
      montoOfrenda,
      pagada,
      montoPagado,
      fechaPago
    } = object

    if (idFeligres === undefined || idFeligres === null) return [`${validationMessages.required('idFeligres')}`]
    if (idTipoIntencion === undefined || idTipoIntencion === null) return [`${validationMessages.required('idTipoIntencion')}`]
    if (idEstadoIntencion === undefined || idEstadoIntencion === null) return [`${validationMessages.required('idEstadoIntencion')}`]
    if (!descripcion) return [`${validationMessages.required('descripcion')}`]

    const fechaPagoP = fechaPago ? new Date(fechaPago) : null

    if (montoPagado !== undefined && montoOfrenda !== undefined && montoPagado > montoOfrenda) {
      return ['The MontoPagado cannot be greater than MontoOfrenda']
    }

    return [
      undefined!,
      new CreateIntencionDto(
        idFeligres,
        idEvento,
        idTipoIntencion,
        idEstadoIntencion,
        descripcion,
        montoOfrenda,
        pagada,
        montoPagado,
        fechaPagoP
      )
    ]
  }
}

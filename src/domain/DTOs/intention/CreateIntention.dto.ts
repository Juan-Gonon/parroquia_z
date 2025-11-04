/* eslint-disable @typescript-eslint/space-before-function-paren */
/* eslint-disable curly */
/* eslint-disable @typescript-eslint/comma-dangle */
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
  private constructor(
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

  static create(
    object: CreateIntencionDtoBody
  ): [string?, CreateIntencionDto?] {
    const {
      idFeligres,
      idEvento,
      idTipoIntencion,
      idEstadoIntencion,
      descripcion,
      montoOfrenda,
      pagada,
      montoPagado,
      fechaPago,
    } = object

    if (idFeligres === undefined || idFeligres === null)
      return [`${validationMessages.required('idFeligres')}`]
    if (idTipoIntencion === undefined || idTipoIntencion === null)
      return [`${validationMessages.required('idTipoIntencion')}`]
    if (idEstadoIntencion === undefined || idEstadoIntencion === null)
      return [`${validationMessages.required('idEstadoIntencion')}`]
    if (!descripcion) return [`${validationMessages.required('descripcion')}`]

    // montos no negativos
    if (montoOfrenda !== undefined && montoOfrenda < 0)
      return ['MontoOfrenda cannot be negative']
    if (montoPagado !== undefined && montoPagado < 0)
      return ['MontoPagado cannot be negative']

    if (pagada === true) {
      if (montoPagado === undefined || montoPagado === null)
        return ['If pagada is true, montoPagado is required']
      if (!fechaPago) return ['If pagada is true, fechaPago is required']
    }

    const fechaPagoP = fechaPago ? new Date(fechaPago) : null

    return [
      undefined!,
      new CreateIntencionDto(
        +idFeligres,
        +idEvento,
        +idTipoIntencion,
        +idEstadoIntencion,
        descripcion,
        montoOfrenda,
        pagada,
        montoPagado,
        fechaPagoP
      ),
    ]
  }
}

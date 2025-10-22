/* eslint-disable @typescript-eslint/comma-dangle */
/* eslint-disable @typescript-eslint/space-before-function-paren */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

export interface UpdateIntencionDtoBody {
  id: number
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

export class UpdateIntencionDto {
  private constructor(
    public readonly id: number,
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

  get values(): { [key: string]: any } {
    const returnObject: { [key: string]: any } = {}
    if (this.idFeligres !== undefined) {
      returnObject.id_feligres = this.idFeligres
    }
    if (this.idEvento !== undefined) returnObject.id_evento = this.idEvento
    if (this.idTipoIntencion !== undefined) {
      returnObject.id_tipointencion = this.idTipoIntencion
    }
    if (this.idEstadoIntencion !== undefined) {
      returnObject.id_estadointencion = this.idEstadoIntencion
    }
    if (this.descripcion !== undefined) {
      returnObject.descripcion = this.descripcion
    }
    if (this.montoOfrenda !== undefined) {
      returnObject.montoofrenda = this.montoOfrenda
    }
    if (this.pagada !== undefined) returnObject.pagada = this.pagada
    if (this.montoPagado !== undefined) {
      returnObject.montopagado = this.montoPagado
    }
    if (this.fechaPago !== undefined) returnObject.fechapago = this.fechaPago
    return returnObject
  }

  static update(
    object: UpdateIntencionDtoBody
  ): [string?, UpdateIntencionDto?] {
    const {
      id,
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

    if (!id || isNaN(+id)) {
      return ['Missing id']
    }

    if (
      !idFeligres &&
      !idEvento &&
      !idTipoIntencion &&
      !idEstadoIntencion &&
      !descripcion &&
      !montoOfrenda &&
      !pagada &&
      !montoPagado &&
      !fechaPago
    ) {
      return ['Nothing to update']
    }

    // montos no negativos
    if (montoOfrenda !== undefined && montoOfrenda < 0) {
      return ['MontoOfrenda cannot be negative']
    }
    if (montoPagado !== undefined && montoPagado < 0) {
      return ['MontoPagado cannot be negative']
    }

    if (pagada === true) {
      if (montoPagado === undefined || montoPagado === null) {
        return ['If pagada is true, montoPagado is required']
      }
      if (!fechaPago) return ['If pagada is true, fechaPago is required']
    }

    const fechaPagoP = fechaPago ? new Date(fechaPago) : null

    return [
      undefined!,
      new UpdateIntencionDto(
        +id,
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

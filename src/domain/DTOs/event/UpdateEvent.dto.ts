/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

interface UpdateEventoDtoBody {
  id?: number
  nombre?: string
  fechaIni?: Date | null
  fechaFin?: Date | null
  descripcion?: string
  idComunidad?: number
  idTipoEvento?: number
  aceptaIntenciones?: boolean
  requiereInscripcion?: boolean
  idCelebrante?: number
  nombreCelebranteExterno?: string
}

// Clase para el DTO de actualización de Evento
export class UpdateEventoDto {
  private constructor (
    public readonly id: number,
    public readonly nombre?: string,
    public readonly fechaIni?: Date | null,
    public readonly fechaFin?: Date | null,
    public readonly descripcion?: string,
    public readonly idComunidad?: number,
    public readonly idTipoEvento?: number,
    public readonly aceptaIntenciones?: boolean,
    public readonly requiereInscripcion?: boolean,
    public readonly idCelebrante?: number,
    public readonly nombreCelebranteExterno?: string
  ) {}

  get values (): { [key: string]: any } {
    const returnObject: { [key: string]: any } = {}
    if (this.nombre) returnObject.nombre = this.nombre
    if (this.fechaIni) returnObject.fecha_ini = this.fechaIni
    if (this.fechaFin) returnObject.fecha_fin = this.fechaFin
    if (this.descripcion) returnObject.descripcion = this.descripcion
    if (this.idComunidad) returnObject.id_comunidad = this.idComunidad
    if (this.idTipoEvento) returnObject.id_tipoevento = this.idTipoEvento
    if (this.aceptaIntenciones) returnObject.aceptaintenciones = this.aceptaIntenciones
    if (this.requiereInscripcion) returnObject.requiereinscripcion = this.requiereInscripcion

    if (this.idCelebrante) {
      returnObject.id_celebrante = this.idCelebrante
      returnObject.nombrecelebranteexterno = null
    } else if (this.nombreCelebranteExterno) {
      returnObject.id_celebrante = null
      returnObject.nombrecelebranteexterno = this.nombreCelebranteExterno
    }
    return returnObject
  }

  static update (object: UpdateEventoDtoBody): [string?, UpdateEventoDto?] {
    const {
      id,
      nombre,
      fechaIni,
      fechaFin,
      descripcion,
      idComunidad,
      idTipoEvento,
      aceptaIntenciones,
      requiereInscripcion,
      idCelebrante,
      nombreCelebranteExterno
    } = object

    // Se valida que se proporcione el ID y que sea un número válido
    if (!id || isNaN(+id)) {
      return ['Missing id']
    }

    // Se valida la lógica del celebrante: ambos campos no pueden actualizarse al mismo tiempo
    if (idCelebrante && nombreCelebranteExterno) {
      return ['Cannot update both idCelebrante and nombreCelebranteExterno at the same time.']
    }

    // Se valida que al menos un campo esté presente para actualizar
    if (!nombre && !fechaIni && !fechaFin && !descripcion && !idComunidad && !idTipoEvento && !aceptaIntenciones && !requiereInscripcion && !idCelebrante && !nombreCelebranteExterno) {
      return ['Nothing to update']
    }

    // Validar las fechas
    const fechaIniObj = fechaIni ? new Date(fechaIni) : null
    const fechaFinObj = fechaFin ? new Date(fechaFin) : null
    if (fechaIniObj && fechaFinObj && fechaIniObj > fechaFinObj) {
      return ['fechaIni cannot be after fechaFin']
    }

    // Se retorna una nueva instancia del DTO con los campos a actualizar
    return [
      undefined!,
      new UpdateEventoDto(
        +id,
        nombre,
        fechaIniObj,
        fechaFinObj,
        descripcion,
        idComunidad ? +idComunidad : undefined,
        idTipoEvento ? +idTipoEvento : undefined,
        aceptaIntenciones,
        requiereInscripcion,
        idCelebrante ? +idCelebrante : undefined,
        nombreCelebranteExterno
      )
    ]
  }
}

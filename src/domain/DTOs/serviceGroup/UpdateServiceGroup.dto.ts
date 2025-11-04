/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

// Define la interfaz para el DTO de actualización
interface UpdateGrupoServicioDtoBody {
  id?: number
  nombre?: string
  descripcion?: string
  activo?: boolean
  idMinisterio?: number
}

export class UpdateGrupoServicioDto {
  private constructor (
    public readonly id: number,
    public readonly nombre?: string,
    public readonly descripcion?: string,
    public readonly activo?: boolean,
    public readonly idMinisterio?: number
  ) {}

  get values (): { [key: string]: any } {
    const returnObject: { [key: string]: any } = {}
    if (this.nombre !== undefined) returnObject.nombre = this.nombre
    if (this.descripcion !== undefined) returnObject.descripcion = this.descripcion
    if (this.activo !== undefined) returnObject.activo = this.activo
    if (this.idMinisterio !== undefined) returnObject.id_ministerio = +this.idMinisterio
    return returnObject
  }

  static update (object: UpdateGrupoServicioDtoBody): [string?, UpdateGrupoServicioDto?] {
    const { id, nombre, descripcion, activo, idMinisterio } = object

    if (!id || isNaN(+id)) {
      return ['Missing id']
    }

    if (
      nombre === undefined &&
      descripcion === undefined &&
      activo === undefined &&
      idMinisterio === undefined
    ) {
      return ['Nothing to update']
    }

    return [undefined!, new UpdateGrupoServicioDto(+id, nombre, descripcion, activo, idMinisterio)]
  }
}

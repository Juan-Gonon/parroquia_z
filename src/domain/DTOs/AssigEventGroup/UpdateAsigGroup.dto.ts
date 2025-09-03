/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

interface UpdateAsigGrupoEventoDtoBody {
  id: number
  idEvento?: number
  idGrpSrv?: number
  notas?: string
}

export class UpdateAsigGrupoEventoDto {
  private constructor (
    public readonly id: number,
    public readonly idEvento?: number,
    public readonly idGrpSrv?: number,
    public readonly notas?: string
  ) {}

  get values (): { [key: string]: any } {
    const returnObject: { [key: string]: any } = {}
    if (this.idEvento) returnObject.id_evento = +this.idEvento
    if (this.idGrpSrv) returnObject.id_grp_srv = +this.idGrpSrv
    if (this.notas !== undefined) returnObject.notas = this.notas
    return returnObject
  }

  static update (object: UpdateAsigGrupoEventoDtoBody): [string?, UpdateAsigGrupoEventoDto?] {
    const { id, idEvento, idGrpSrv, notas } = object

    // Se valida que se proporcione el ID y que sea un número válido
    if (!id || isNaN(+id)) {
      return ['Missing id']
    }

    // Se valida que al menos un campo esté presente para actualizar
    if (!idEvento && !idGrpSrv && notas === undefined) {
      return ['Nothing to update']
    }

    // Se valida el formato de los campos opcionales si están presentes
    if (idEvento && isNaN(+idEvento)) {
      return ['The idEvento is not a number']
    }
    if (idGrpSrv && isNaN(+idGrpSrv)) {
      return ['The idGrpSrv is not a number']
    }
    if (notas !== undefined && typeof notas !== 'string') {
      return ['The notas is not a string']
    }

    return [undefined!, new UpdateAsigGrupoEventoDto(+id, idEvento, idGrpSrv, notas)]
  }
}

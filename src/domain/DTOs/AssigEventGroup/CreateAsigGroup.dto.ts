/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

interface CreateAsigGrupoEventoDtoBody {
  idEvento: number
  idGrpSrv: number
  notas?: string
}

export class CreateAsigGrupoEventoDto {
  private constructor (
    public readonly idEvento: number,
    public readonly idGrpSrv: number,
    public readonly notas?: string
  ) {}

  static create (object: CreateAsigGrupoEventoDtoBody): [string?, CreateAsigGrupoEventoDto?] {
    const { idEvento, idGrpSrv, notas } = object

    // Validar campos obligatorios
    if (!idEvento) {
      return ['Missing idEvento']
    }
    if (!idGrpSrv) {
      return ['Missing idGrpSrv']
    }

    // Validar tipo de datos
    if (isNaN(+idEvento)) {
      return ['The idEvento is not a number']
    }
    if (isNaN(+idGrpSrv)) {
      return ['The idGrpSrv is not a number']
    }
    if (notas && typeof notas !== 'string') {
      return ['The notas is not a string']
    }

    return [undefined!, new CreateAsigGrupoEventoDto(+idEvento, +idGrpSrv, notas)]
  }
}

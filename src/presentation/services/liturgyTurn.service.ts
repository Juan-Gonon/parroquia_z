/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { prisma } from '../../data/postgress'
import { CustomError, PaginationDto } from '../../domain'
import { CreateTurnoLiturgicoComunitarioDto } from '../../domain/DTOs/liturgyTurn/CreateLiturgyTurn.dto'
import { UpdateTurnoLiturgicoComunitarioDto } from '../../domain/DTOs/liturgyTurn/UpdateLiturgyTurn.dto'

export class TurnoLiturgicoComunitarioService {
//   public async getTurnoByNombre (nombre: string): Promise<TurnoLiturgicoComunitarioResponseDto | null> {
//     try {
//       const turno = await prisma.turnoliturgocomunitario.findFirst({
//         where: {

  //         }
  //       })
  //       return turno
  //     } catch (error) {
  //       if (error instanceof CustomError) {
  //         throw error
  //       }
  //       return null
  //     }
  //   }

  public async getTurnoById (id: number): Promise<any> {
    try {
      const turno = await prisma.turnoliturgocomunitario.findFirst({
        where: {
          id_turno: id
        }
      })
      if (!turno) throw CustomError.badRequest('The specified turno liturgico does not exist')
      return turno
    } catch (error) {
      if (error instanceof CustomError) throw error
      throw CustomError.internalServer('Internal server error')
    }
  }

  public async getAllTurnos (paginationDTO: PaginationDto): Promise<any> {
    const { page, limit } = paginationDTO
    const offset = (page - 1) * limit

    try {
      const [total, turnos] = await prisma.$transaction([
        prisma.turnoliturgocomunitario.count(),
        prisma.turnoliturgocomunitario.findMany({
          skip: offset,
          take: limit
        })
      ])
      if (!turnos || turnos.length === 0) throw CustomError.badRequest('The turnos are empty')

      return {
        page,
        limit,
        total,
        next: (page * limit) < total ? `/api/liturgy-turns?page=${page + 1}&limit=${limit}` : null,
        prev: page > 1 ? `/api/liturgy-turns?page=${page - 1}&limit=${limit}` : null,
        turnos
      }
    } catch (error) {
      if (error instanceof CustomError) {
        throw error
      }
      throw CustomError.internalServer('Internal server error')
    }
  }

  public async createTurno (createTurnoDto: CreateTurnoLiturgicoComunitarioDto): Promise<any> {
    try {
      const { idComunidad, idTipoTurno, fechaIni, fechaFin, descripcion } = createTurnoDto

      const existComunidad = await prisma.comunidad.findFirst({
        where: {
          id_comunidad: idComunidad
        }
      })

      if (!existComunidad) {
        throw CustomError.badRequest('Error community not exist')
      }

      const existTipeTurn = await prisma.tipoturno.findFirst({
        where: {
          id_tipo: idTipoTurno
        }
      })

      if (!existTipeTurn) {
        throw CustomError.badRequest('Error type turn not exist')
      }

      const turno = await prisma.turnoliturgocomunitario.create({
        data: {
          id_comunidad: idComunidad,
          id_tipo: idTipoTurno,
          fecha_inicio: fechaIni,
          descripcion: descripcion ?? null,
          fecha_fin: fechaFin ?? null
        }
      })
      return turno
    } catch (error) {
      if (error instanceof CustomError) {
        throw error
      }
      throw CustomError.internalServer('Error internal server')
    }
  }

  public async updateTurno (updateTurnoDto: UpdateTurnoLiturgicoComunitarioDto): Promise<any> {
    const turnoById = await this.getTurnoById(updateTurnoDto.id)
    try {
      if (!turnoById) throw CustomError.badRequest('Turno not found')

      const fechaIni = updateTurnoDto.fechaIni ? updateTurnoDto.fechaIni : turnoById.fecha_inicio
      const fechaFin = updateTurnoDto.fechaFin ? updateTurnoDto.fechaFin : null

      if (fechaIni && fechaFin !== null && fechaIni > updateTurnoDto.fechaFin!) {
        throw CustomError.badRequest('fecha_inicio cannot be after fecha_fin')
      }

      const uTurno = await prisma.turnoliturgocomunitario.update({
        data: updateTurnoDto.values,
        where: {
          id_turno: turnoById.id_turno
        }
      })
      return uTurno
    } catch (error) {
      if (error instanceof CustomError) throw error
      throw CustomError.internalServer('Internal server error')
    }
  }

  public async deleteTurno (id: number): Promise<{ success: boolean, message: string }> {
    const turnoExist = await this.getTurnoById(id)
    try {
      if (!turnoExist) throw CustomError.badRequest('Turno not found')

      await prisma.turnoliturgocomunitario.delete({
        where: {
          id_turno: id
        }
      })
      return {
        success: true,
        message: 'Turno deleted successfully'
      }
    } catch (error) {
      if (error instanceof CustomError) throw error
      throw CustomError.internalServer('Internal server error')
    }
  }
}

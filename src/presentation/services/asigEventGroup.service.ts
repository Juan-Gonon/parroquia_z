/* eslint-disable @typescript-eslint/space-before-function-paren */
/* eslint-disable @typescript-eslint/comma-dangle */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { prisma } from '../../data/postgress'
import { CustomError, PaginationDto } from '../../domain'
import { CreateAsigGrupoEventoDto } from '../../domain/DTOs/AssigEventGroup/CreateAsigGroup.dto'
import { UpdateAsigGrupoEventoDto } from '../../domain/DTOs/AssigEventGroup/UpdateAsigGroup.dto'

export class AsigGrupoEventoService {
  // Obtener todas las asignaciones
  public async getAllAsignaciones(pagination: PaginationDto): Promise<any> {
    const { page, limit } = pagination

    try {
      const [total, asignaciones] = await Promise.all([
        prisma.asiggrupoevento.count(),
        prisma.asiggrupoevento.findMany({
          take: limit,
          skip: (page - 1) * limit,
        }),
      ])

      return {
        page,
        limit,
        total,
        next:
          page * limit < total
            ? `/api/asigeventgroup?page=${page + 1}&limit=${limit}`
            : null,
        prev:
          page - 1 > 0
            ? `/api/asigeventgroup?page=${page - 1}&limit=${limit}`
            : null,
        data: asignaciones,
      }
    } catch (error) {
      throw CustomError.internalServer('Something went wrong')
    }
  }

  // Obtener una asignación por su ID
  public async getAsignacionById(id: number): Promise<any> {
    const asignacion = await prisma.asiggrupoevento.findMany({
      where: {
        id_evento: id,
      },
      select: {
        id_asig_ge: true,
        id_evento: true,
        id_grp_srv: true,
        gruposervicio: {
          select: {
            id_grupo: true,
            nombre: true,
            ministerio: {
              select: {
                nombre: true,
              },
            },
          },
        },
      },
    })

    if (!asignacion) {
      throw CustomError.notFound(`Asignacion with id ${id} not found`)
    }

    return asignacion
  }

  // Crear una nueva asignación
  public async createAsignacion(
    createDto: CreateAsigGrupoEventoDto
  ): Promise<any> {
    try {
      const nuevaAsignacion = await prisma.asiggrupoevento.create({
        data: {
          id_evento: createDto.idEvento,
          id_grp_srv: createDto.idGrpSrv,
          notas: createDto.notas ?? null,
        },
      })

      return nuevaAsignacion
    } catch (error: any) {
      if (error.code === 'P2003') {
        // Foreign key constraint failed
        throw CustomError.badRequest('Referenced id not found')
      }
      throw CustomError.internalServer(
        'Something went wrong creating the asignacion'
      )
    }
  }

  // Actualizar una asignación
  public async updateAsignacion(
    updateDto: UpdateAsigGrupoEventoDto
  ): Promise<any> {
    const { id } = updateDto

    const asignacionExistente = await prisma.asiggrupoevento.findUnique({
      where: {
        id_asig_ge: id,
      },
    })

    if (!asignacionExistente) {
      throw CustomError.notFound(`Asignacion with id ${id} not found`)
    }

    try {
      const asignacionActualizada = await prisma.asiggrupoevento.update({
        where: {
          id_asig_ge: id,
        },
        data: updateDto.values,
      })

      return asignacionActualizada
    } catch (error: any) {
      if (error.code === 'P2003') {
        // Foreign key constraint failed
        throw CustomError.badRequest('Referenced id not found')
      }
      console.log(error)
      throw CustomError.internalServer(
        'Something went wrong updating the asignacion'
      )
    }
  }

  // Eliminar una asignación
  public async deleteAsignacion(id: number): Promise<any> {
    const asignacionExistente = await prisma.asiggrupoevento.findUnique({
      where: {
        id_asig_ge: id,
      },
    })

    if (!asignacionExistente) {
      throw CustomError.notFound(`Asignacion with id ${id} not found`)
    }

    try {
      await prisma.asiggrupoevento.delete({
        where: {
          id_asig_ge: id,
        },
      })
      return { message: `Asignacion with id ${id} deleted` }
    } catch (error) {
      throw CustomError.internalServer(
        'Something went wrong deleting the asignacion'
      )
    }
  }
}

/* eslint-disable @typescript-eslint/space-before-function-paren */
/* eslint-disable @typescript-eslint/comma-dangle */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { prisma } from '../../data/postgress'
import { CustomError, PaginationDto } from '../../domain'
import { CreateIntencionDto } from '../../domain/DTOs/intention/CreateIntention.dto'
import { UpdateIntencionDto } from '../../domain/DTOs/intention/UpdateIntention.dto'

export class IntencionService {
  public async getIntencionById(id: number): Promise<any> {
    try {
      const intencion = await prisma.intencion.findMany({
        where: {
          id_evento: id,
        },
        select: {
          id_evento: true,
          id_intencion: true,
          descripcion: true,
          fechasolicitud: true,
          pagada: true,
          montopagado: true,
          montoofrenda: true,
          estadointencion: true,
          feligres: {
            select: {
              nombre: true,
              apellido: true,
              id_feligres: true,
            },
          },
          tipointencion: {
            select: {
              id_tipointencion: true,
              nombre: true,
            },
          },
        },
      })
      if (!intencion) {
        throw CustomError.badRequest('The specified intention does not exist')
      }
      return intencion
    } catch (error) {
      if (error instanceof CustomError) throw error
      throw CustomError.internalServer('Internal server error')
    }
  }

  public async getIntencionByIdT(id: number): Promise<any> {
    try {
      const intencion = await prisma.intencion.findFirst({
        where: {
          id_intencion: id,
        },
      })
      if (!intencion) {
        throw CustomError.badRequest('The specified intention does not exist')
      }
      return intencion
    } catch (error) {
      if (error instanceof CustomError) throw error
      throw CustomError.internalServer('Internal server error')
    }
  }

  public async getAllIntenciones(paginationDTO: PaginationDto): Promise<any> {
    const { page, limit } = paginationDTO
    const offset = (page - 1) * limit

    try {
      const [total, intenciones] = await prisma.$transaction([
        prisma.intencion.count(),
        prisma.intencion.findMany({
          skip: offset,
          take: limit,
        }),
      ])
      if (!intenciones || intenciones.length === 0) {
        throw CustomError.badRequest('There are no intentions to display')
      }

      return {
        page,
        limit,
        total,
        next:
          page * limit < total
            ? `/api/intention?page=${page + 1}&limit=${limit}`
            : null,
        prev:
          page > 1 ? `/api/intention?page=${page - 1}&limit=${limit}` : null,
        intenciones,
      }
    } catch (error) {
      if (error instanceof CustomError) {
        throw error
      }
      throw CustomError.internalServer('Internal server error')
    }
  }

  public async createIntencion(
    createIntencionDto: CreateIntencionDto
  ): Promise<any> {
    // Validate existence of related entities
    const feligresExists = await prisma.feligres.findUnique({
      where: { id_feligres: createIntencionDto.idFeligres },
    })
    if (!feligresExists) {
      throw CustomError.badRequest('The specified Feligres does not exist')
    }

    const tipoIntencionExists = await prisma.tipointencion.findUnique({
      where: { id_tipointencion: createIntencionDto.idTipoIntencion },
    })
    if (!tipoIntencionExists) {
      throw CustomError.badRequest('The specified TipoIntencion does not exist')
    }

    const estadoIntencionExists = await prisma.estadointencion.findUnique({
      where: { id_estadoin: createIntencionDto.idEstadoIntencion },
    })
    if (!estadoIntencionExists) {
      throw CustomError.badRequest(
        'The specified EstadoIntencion does not exist'
      )
    }

    if (createIntencionDto.idEvento) {
      const eventoExists = await prisma.evento.findUnique({
        where: { id_evento: createIntencionDto.idEvento },
      })
      if (!eventoExists) {
        throw CustomError.badRequest('The specified Evento does not exist')
      }
    }

    try {
      const intencion = await prisma.intencion.create({
        data: {
          id_feligres: createIntencionDto.idFeligres,
          id_evento: createIntencionDto.idEvento ?? null,
          id_tipointencion: createIntencionDto.idTipoIntencion,
          id_estadointencion: createIntencionDto.idEstadoIntencion,
          descripcion: createIntencionDto.descripcion,
          montoofrenda: createIntencionDto.montoOfrenda ?? 0,
          pagada: createIntencionDto.pagada ?? false,
          montopagado: createIntencionDto.montoPagado ?? null,
          fechapago: createIntencionDto.fechaPago ?? null,
        },
      })
      return intencion
    } catch (error) {
      if (error instanceof CustomError) {
        throw error
      }
      throw CustomError.internalServer('Internal server error')
    }
  }

  public async updateIntencion(
    updateIntencionDto: UpdateIntencionDto
  ): Promise<any> {
    const intencionById = await this.getIntencionByIdT(updateIntencionDto.id)

    // Validate existence of related entities if they are being updated
    if (updateIntencionDto.idFeligres) {
      const feligresExists = await prisma.feligres.findUnique({
        where: { id_feligres: updateIntencionDto.idFeligres },
      })
      if (!feligresExists) {
        throw CustomError.badRequest('The specified Feligres does not exist')
      }
    }

    if (updateIntencionDto.idTipoIntencion) {
      const tipoIntencionExists = await prisma.tipointencion.findUnique({
        where: { id_tipointencion: updateIntencionDto.idTipoIntencion },
      })
      if (!tipoIntencionExists) {
        throw CustomError.badRequest(
          'The specified TipoIntencion does not exist'
        )
      }
    }

    if (updateIntencionDto.idEstadoIntencion) {
      const estadoIntencionExists = await prisma.estadointencion.findUnique({
        where: { id_estadoin: updateIntencionDto.idEstadoIntencion },
      })
      if (!estadoIntencionExists) {
        throw CustomError.badRequest(
          'The specified EstadoIntencion does not exist'
        )
      }
    }

    if (updateIntencionDto.idEvento) {
      const eventoExists = await prisma.evento.findUnique({
        where: { id_evento: updateIntencionDto.idEvento },
      })
      if (!eventoExists) {
        throw CustomError.badRequest('The specified Evento does not exist')
      }
    }

    try {
      if (!intencionById) throw CustomError.badRequest('Intencion not found')

      const uIntencion = await prisma.intencion.update({
        data: updateIntencionDto.values,
        where: {
          id_intencion: intencionById.id_intencion,
        },
      })
      return uIntencion
    } catch (error) {
      if (error instanceof CustomError) throw error
      throw CustomError.internalServer('Internal server error')
    }
  }

  public async deleteIntencion(id: number): Promise<object> {
    const intencionExist = await this.getIntencionByIdT(id)
    try {
      if (!intencionExist) throw CustomError.badRequest('Intencion not found')

      await prisma.intencion.delete({
        where: {
          id_intencion: id,
        },
      })
      return {
        success: true,
        message: 'Intencion deleted successfully',
      }
    } catch (error) {
      if (error instanceof CustomError) throw error
      throw CustomError.internalServer('Internal server error')
    }
  }
}

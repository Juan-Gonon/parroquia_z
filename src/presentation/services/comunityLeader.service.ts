/* eslint-disable @typescript-eslint/space-before-function-paren */
/* eslint-disable @typescript-eslint/comma-dangle */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { prisma } from '../../data/postgress'
import { CustomError, PaginationDto } from '../../domain'
import { CreateLiderComunitarioDto } from '../../domain/DTOs/comunityLeader/CreateComunityLeader.dto'
import { UpdateLiderComunitarioDto } from '../../domain/DTOs/comunityLeader/UpdateComunityLeader.dto'

export class LiderComunitarioService {
  // Obtener un Líder por ID
  public async getLiderById(id: number): Promise<any> {
    const lider = await prisma.lidercomunitario.findUnique({
      where: { id_lider: id },
    })
    if (lider === null) {
      throw CustomError.badRequest('The requested leader was not found.')
    }
    return lider
  }

  // Obtener todos los Líderes con paginación
  public async getAllLideres(paginationDto: PaginationDto): Promise<any> {
    const { page, limit } = paginationDto
    try {
      const [total, lideres] = await prisma.$transaction([
        prisma.lidercomunitario.count(),
        prisma.lidercomunitario.findMany({
          skip: (page - 1) * limit,
          take: limit,
          include: {
            comunidad: {
              select: {
                id_comunidad: true,
                id_parroquia: true,
                nombre: true,
              },
            },
            personalparroquial: {
              select: {
                nombre: true,
                apellido: true,
                telefono: true,
                email: true,
                direccion: true,
              },
            },
          },
        }),
      ])

      return {
        page,
        limit,
        total,
        next:
          page * limit < total
            ? `/api/comunity-leader?page=${page + 1}&limit=${limit}`
            : null,
        prev:
          page - 1 > 0
            ? `/api/comunity-leader?page=${page - 1}&limit=${limit}`
            : null,
        data: lideres,
      }
    } catch (error) {
      throw CustomError.internalServer(
        'An error occurred while retrieving the data.'
      )
    }
  }

  // Crear un nuevo Líder
  public async createLider(
    createLiderDto: CreateLiderComunitarioDto
  ): Promise<any> {
    const personalExist = await prisma.personalparroquial.findFirst({
      where: {
        id_personal: createLiderDto.idPersonal,
      },
    })

    if (!personalExist) {
      throw CustomError.badRequest('Error personal not exist')
    }

    const comunityExist = await prisma.comunidad.findFirst({
      where: {
        id_comunidad: createLiderDto.idComunidad,
      },
    })

    if (!comunityExist) {
      throw CustomError.badRequest('Error community not exist')
    }
    const liderExists = await prisma.lidercomunitario.findFirst({
      where: {
        id_personal: createLiderDto.idPersonal,
        id_comunidad: createLiderDto.idComunidad,
      },
    })

    if (liderExists) {
      throw CustomError.badRequest(
        'A community leader with that personal ID and community ID already exists.'
      )
    }
    try {
      const newLider = await prisma.lidercomunitario.create({
        data: {
          id_personal: createLiderDto.idPersonal,
          id_comunidad: createLiderDto.idComunidad,
          fecha_ini: createLiderDto.fechaIni,
          fecha_fin: createLiderDto.fechaFin ?? null,
          activo: createLiderDto.activo ?? true,
          rolliderazgo: createLiderDto.rolliderazgo,
        },
      })
      return newLider
    } catch (error) {
      throw CustomError.internalServer(
        'An error occurred while creating the community leader.'
      )
    }
  }

  // Actualizar un Líder
  public async updateLider(
    updateLiderDto: UpdateLiderComunitarioDto
  ): Promise<any> {
    const liderExists = await this.getLiderById(updateLiderDto.id)
    if (!liderExists) {
      throw CustomError.badRequest(
        'The requested leader to update was not found.'
      )
    }

    try {
      const fechaIni = updateLiderDto.fechaIni
        ? updateLiderDto.fechaIni
        : liderExists.fecha_ini
      const fechaFin = updateLiderDto.fechaFin ? updateLiderDto.fechaFin : null

      if (fechaFin !== null && fechaIni > fechaFin) {
        throw CustomError.badRequest('fechaIni cannot be after fechaFin')
      }

      const updatedLider = await prisma.lidercomunitario.update({
        where: { id_lider: updateLiderDto.id },
        data: { ...updateLiderDto.values },
      })
      return updatedLider
    } catch (error) {
      if (error instanceof CustomError) {
        throw error
      }
      throw CustomError.internalServer(
        'An error occurred while updating the community leader.'
      )
    }
  }

  // Eliminar un Líder
  public async deleteLider(id: number): Promise<any> {
    const liderExists = await this.getLiderById(id)
    if (!liderExists) {
      throw CustomError.badRequest(
        'The requested leader to delete was not found.'
      )
    }
    try {
      await prisma.lidercomunitario.delete({
        where: { id_lider: id },
      })
      return { message: 'Community leader successfully deleted.' }
    } catch (error) {
      throw CustomError.internalServer(
        'An error occurred while deleting the community leader.'
      )
    }
  }
}

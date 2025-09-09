/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { prisma } from '../../data/postgress'
import { CustomError, PaginationDto } from '../../domain'
import { CreateParticipacionDto } from '../../domain/DTOs/MinistryPart/CreateMinistryP.dto'
import { UpdateParticipacionDto } from '../../domain/DTOs/MinistryPart/UpdateMinistry.dto'

export class ParticipacionMinisterioService {
  // Obtener un registro de participación de ministerio por su ID
  public async getParticipacionById (id: number): Promise<any> {
    const participacion = await prisma.participacionministerio.findUnique({
      where: { id_part_min: id }
    })
    if (participacion == null) {
      throw CustomError.badRequest('The requested participation was not found.')
    }
    return participacion
  }

  // Obtener todas las participaciones de ministerio con paginación
  public async getAllParticipaciones (paginationDto: PaginationDto): Promise<any> {
    const { page, limit } = paginationDto

    try {
      const [total, participaciones] = await prisma.$transaction([
        prisma.participacionministerio.count(),
        prisma.participacionministerio.findMany({
          skip: (page - 1) * limit,
          take: limit
        })
      ])

      return {
        page,
        limit,
        total,
        next: (page * limit) < total ? `/api/ministy-participation?page=${page + 1}&limit=${limit}` : null,
        prev: (page - 1 > 0) ? `/api/ministy-participation?page=${page - 1}&limit=${limit}` : null,
        data: participaciones
      }
    } catch (error) {
      throw CustomError.internalServer('An error occurred while retrieving the data.')
    }
  }

  // Crear una nueva participación de ministerio
  public async createParticipacion (
    createParticipacionDto: CreateParticipacionDto
  ): Promise<any> {
    // Verificar si las relaciones existen
    const personalExists = await prisma.personalparroquial.findUnique({ where: { id_personal: createParticipacionDto.idPersonal } })
    if (personalExists == null) {
      throw CustomError.badRequest('The specified personal does not exist.')
    }

    const ministerioExists = await prisma.ministerio.findUnique({ where: { id_ministerio: createParticipacionDto.idMinisterio } })
    if (ministerioExists == null) {
      throw CustomError.badRequest('The specified ministry does not exist.')
    }

    const rolExists = await prisma.roldentroministerio.findUnique({ where: { id_roldentroministerio: createParticipacionDto.idRol } })
    if (rolExists == null) {
      throw CustomError.badRequest('The specified role does not exist.')
    }

    try {
      const newParticipacion = await prisma.participacionministerio.create({
        data: {
          id_personal: createParticipacionDto.idPersonal,
          id_ministerio: createParticipacionDto.idMinisterio,
          id_roldentroministerio: createParticipacionDto.idRol,
          fecha_ini_part: createParticipacionDto.fechaIniP,
          fecha_fin_part: createParticipacionDto.fechaFinP ?? null,
          activo: createParticipacionDto.activo ?? true
        }
      })
      return newParticipacion
    } catch (error) {
      throw CustomError.internalServer('An error occurred while creating the participation.')
    }
  }

  // Actualizar una participación de ministerio
  public async updateParticipacion (
    updateParticipacionDto: UpdateParticipacionDto
  ): Promise<any> {
    const participacionExists = await this.getParticipacionById(updateParticipacionDto.id)
    if (!participacionExists) {
      throw CustomError.badRequest('The requested participation to update was not found.')
    }

    // Validar las relaciones si se están actualizando
    if (updateParticipacionDto.idPersonal) {
      const personalExists = await prisma.personalparroquial.findUnique({ where: { id_personal: updateParticipacionDto.idPersonal } })
      if (personalExists == null) {
        throw CustomError.badRequest('The specified personal does not exist.')
      }
    }

    if (updateParticipacionDto.idMinisterio) {
      const ministerioExists = await prisma.ministerio.findUnique({ where: { id_ministerio: updateParticipacionDto.idMinisterio } })
      if (ministerioExists == null) {
        throw CustomError.badRequest('The specified ministry does not exist.')
      }
    }

    if (updateParticipacionDto.idRol) {
      const rolExists = await prisma.roldentroministerio.findUnique({ where: { id_roldentroministerio: updateParticipacionDto.idRol } })
      if (rolExists == null) {
        throw CustomError.badRequest('The specified role does not exist.')
      }
    }

    try {
      const updatedParticipacion = await prisma.participacionministerio.update({
        where: { id_part_min: updateParticipacionDto.id },
        data: updateParticipacionDto.values
      })
      return updatedParticipacion
    } catch (error) {
      throw CustomError.internalServer('An error occurred while updating the participation.')
    }
  }

  // Eliminar una participación de ministerio
  public async deleteParticipacion (id: number): Promise<any> {
    const participacionExists = await this.getParticipacionById(id)
    if (!participacionExists) {
      throw CustomError.badRequest('The requested participation to delete was not found.')
    }
    try {
      await prisma.participacionministerio.delete({
        where: { id_part_min: id }
      })
      return { message: 'Participation successfully deleted' }
    } catch (error) {
      throw CustomError.internalServer('An error occurred while deleting the participation.')
    }
  }
}

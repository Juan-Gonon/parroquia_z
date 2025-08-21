/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { prisma } from '../../data/postgress'
import { CustomError, PaginationDto } from '../../domain'
import { CreatePersonalParroquialDto } from '../../domain/DTOs/parishStaff/CreateParishStaff.dto'
import { UpdatePersonalParroquialDto } from '../../domain/DTOs/parishStaff/UpdateParishStaff.dto'

export class PersonalParroquialService {
  // Obtener un registro de personal por su email
  public async getPersonalByEmail (email: string): Promise<any | null> {
    const personal = await prisma.personalparroquial.findUnique({
      where: { email }
    })
    return personal
  }

  // Obtener un registro de personal por su ID
  public async getPersonalById (id: number): Promise<any> {
    const personal = await prisma.personalparroquial.findUnique({
      where: { id_personal: id }
    })
    if (personal == null) {
      throw CustomError.badRequest('The requested PersonalParroquial was not found.')
    }
    return personal
  }

  // Obtener todo el personal parroquial con paginación
  public async getAllPersonal (
    paginationDto: PaginationDto
  ): Promise<any> {
    const { page, limit } = paginationDto

    try {
      const [total, personal] = await prisma.$transaction([
        prisma.personalparroquial.count(),
        prisma.personalparroquial.findMany({
          skip: (page - 1) * limit,
          take: limit
        })
      ])

      return {
        page,
        limit,
        total,
        next: (page * limit) < total ? `/api/parish-staff?page=${page + 1}&limit=${limit}` : null,
        prev: (page - 1 > 0) ? `/api/parish-staff?page=${page - 1}&limit=${limit}` : null,
        data: personal
      }
    } catch (error) {
      throw CustomError.internalServer('An error occurred while retrieving the data.')
    }
  }

  // Crear un nuevo registro de personal parroquial
  public async createPersonal (
    createPersonalDto: CreatePersonalParroquialDto
  ): Promise<any> {
    if (createPersonalDto.email) {
      const personalExists = await this.getPersonalByEmail(createPersonalDto.email)
      if (personalExists) {
        throw CustomError.badRequest('A PersonalParroquial with that email already exists.')
      }
    }

    try {
      const newPersonal = await prisma.personalparroquial.create({
        data: {
          nombre: createPersonalDto.nombre,
          apellido: createPersonalDto.apellido,
          direccion: createPersonalDto.direccion ?? null,
          email: createPersonalDto.email ?? null,
          telefono: createPersonalDto.telefono ?? null
        }
      })
      return newPersonal
    } catch (error) {
      throw CustomError.internalServer('An error occurred while creating the PersonalParroquial.')
    }
  }

  // Actualizar un registro de personal parroquial
  public async updatePersonal (
    updatePersonalDto: UpdatePersonalParroquialDto
  ): Promise<any> {
    const personalExists = await this.getPersonalById(updatePersonalDto.id)
    if (!personalExists) {
      throw CustomError.badRequest('The requested PersonalParroquial to update was not found.')
    }

    if (updatePersonalDto.email) {
      const personalEmailExists = await this.getPersonalByEmail(updatePersonalDto.email)
      if (personalEmailExists && personalEmailExists.id_personal !== updatePersonalDto.id) {
        throw CustomError.badRequest('A PersonalParroquial with that email already exists.')
      }
    }

    try {
      const updatedPersonal = await prisma.personalparroquial.update({
        where: { id_personal: updatePersonalDto.id },
        data: { ...updatePersonalDto.values }
      })
      return updatedPersonal
    } catch (error) {
      throw CustomError.internalServer('An error occurred while updating the PersonalParroquial.')
    }
  }

  // Eliminar un registro de personal parroquial
  public async deletePersonal (id: number): Promise<any> {
    const personalExists = await this.getPersonalById(id)
    if (!personalExists) {
      throw CustomError.badRequest('The requested PersonalParroquial to delete was not found.')
    }
    try {
      await prisma.personalparroquial.delete({
        where: { id_personal: id }
      })
      return { message: 'PersonalParroquial successfully deleted' }
    } catch (error) {
      throw CustomError.internalServer('An error occurred while deleting the PersonalParroquial.')
    }
  }
}

/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { prisma } from '../../data/postgress'
import { CustomError, PaginationDto } from '../../domain'
import { CreateFeligresDto } from '../../domain/DTOs/feligres/CreateFeligres.dto'
import { UpdateFeligresDto } from '../../domain/DTOs/feligres/UpdateFeligres.dto'

export class FeligresService {
  public async getFeligresById (id: number): Promise<any> {
    try {
      const feligres = await prisma.feligres.findFirst({
        where: {
          id_feligres: id
        }
      })
      if (!feligres) throw CustomError.badRequest('The specified feligres does not exist')
      return feligres
    } catch (error) {
      if (error instanceof CustomError) throw error
      throw CustomError.internalServer('Internal server error')
    }
  }

  public async getFeligresByEmail (email: string): Promise<any> {
    try {
      const feligres = await prisma.feligres.findFirst({
        where: {
          email
        }
      })

      if (feligres) throw CustomError.badRequest('The email already exists')

      return feligres
    } catch (error) {
      if (error instanceof CustomError) throw error
      throw CustomError.internalServer('Internal server error')
    }
  }

  public async getAllFeligreses (paginationDTO: PaginationDto): Promise<any> {
    const { page, limit } = paginationDTO
    const offset = (page - 1) * limit

    try {
      const [total, feligreses] = await prisma.$transaction([
        prisma.feligres.count(),
        prisma.feligres.findMany({
          skip: offset,
          take: limit
        })
      ])
      if (!feligreses || feligreses.length === 0) throw CustomError.badRequest('The feligreses are empty')

      return {
        page,
        limit,
        total,
        next: (page * limit) < total ? `/api/feligreses?page=${page + 1}&limit=${limit}` : null,
        prev: page > 1 ? `/api/feligreses?page=${page - 1}&limit=${limit}` : null,
        feligreses
      }
    } catch (error) {
      if (error instanceof CustomError) {
        throw error
      }
      throw CustomError.internalServer('Internal server error')
    }
  }

  public async createFeligres (createFeligresDto: CreateFeligresDto): Promise<any> {
    if (createFeligresDto.email) {
      await this.getFeligresByEmail(createFeligresDto.email)
    }
    try {
      const feligres = await prisma.feligres.create({
        data: {
          nombre: createFeligresDto.nombre,
          apellido: createFeligresDto.apellido,
          telefono: createFeligresDto.telefono ?? null,
          email: createFeligresDto.email ?? null
        }
      })
      return feligres
    } catch (error) {
      if (error instanceof CustomError) {
        throw error
      }
      throw CustomError.internalServer('Error internal server')
    }
  }

  public async updateFeligres (updateFeligresDto: UpdateFeligresDto): Promise<any> {
    const feligresById = await this.getFeligresById(updateFeligresDto.id)
    if (updateFeligresDto.email) {
      const feligresEmail = await prisma.feligres.findFirst({
        where: { email: updateFeligresDto.email }
      })

      if (feligresEmail && feligresEmail.id_feligres !== updateFeligresDto.id) {
        throw CustomError.badRequest('The email already exists')
      }
    }
    try {
      if (!feligresById) throw CustomError.badRequest('Feligres not found')

      const uFeligres = await prisma.feligres.update({
        data: updateFeligresDto.values,
        where: {
          id_feligres: feligresById.id_feligres
        }
      })
      return uFeligres
    } catch (error) {
      if (error instanceof CustomError) throw error
      throw CustomError.internalServer('Internal server error')
    }
  }

  public async deleteFeligres (id: number): Promise<{ success: boolean, message: string }> {
    const feligresExist = await this.getFeligresById(id)
    try {
      if (!feligresExist) throw CustomError.badRequest('Feligres not found')

      await prisma.feligres.delete({
        where: {
          id_feligres: id
        }
      })
      return {
        success: true,
        message: 'Feligres deleted successfully'
      }
    } catch (error) {
      if (error instanceof CustomError) throw error
      throw CustomError.internalServer('Internal server error')
    }
  }
}

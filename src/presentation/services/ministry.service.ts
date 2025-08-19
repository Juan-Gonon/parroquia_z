/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { prisma } from '../../data/postgress'
import { CustomError, PaginationDto } from '../../domain'
import { CreateMinisterioDto } from '../../domain/DTOs/ministry/CreateMinistry.dto'
import { UpdateMinisterioDto } from '../../domain/DTOs/ministry/UpdateMinistry.dto'

// Clase de servicio para la lógica de negocio de Ministerio
export class MinisterioService {
  // Obtener un Ministerio por su nombre
  public async getMinisterioByName (nombre: string): Promise<any | null> {
    const ministerio = await prisma.ministerio.findFirst({
      where: { nombre }
    })
    return ministerio
  }

  // Obtener un Ministerio por su ID
  public async getMinisterioById (id: number): Promise<any> {
    const ministerio = await prisma.ministerio.findUnique({
      where: { id_ministerio: id }
    })
    if (!ministerio) {
      throw CustomError.badRequest('The requested Ministry was not found.')
    }
    return ministerio
  }

  // Obtener todos los Ministerios con paginación
  public async getAllMinisterios (
    paginationDto: PaginationDto
  ): Promise<any> {
    const { page, limit } = paginationDto

    try {
      const [total, ministerios] = await prisma.$transaction([
        prisma.ministerio.count(),
        prisma.ministerio.findMany({
          skip: (page - 1) * limit,
          take: limit
        })
      ])

      return {
        page,
        limit,
        total,
        next: (page * limit) < total ? `/api/ministry?page=${page + 1}&limit=${limit}` : null,
        prev: (page - 1 > 0) ? `/api/ministry?page=${page - 1}&limit=${limit}` : null,
        data: ministerios
      }
    } catch (error) {
      throw CustomError.internalServer('An error occurred while retrieving the data.')
    }
  }

  // Crear un nuevo Ministerio
  public async createMinisterio (
    createMinisterioDto: CreateMinisterioDto
  ): Promise<any> {
    const ministerioExists = await this.getMinisterioByName(createMinisterioDto.nombre)
    if (ministerioExists) {
      throw CustomError.badRequest('A Ministry with that name already exists.')
    }
    try {
      const newMinisterio = await prisma.ministerio.create({
        data: {
          nombre: createMinisterioDto.nombre,
          descripcion: createMinisterioDto.descripcion ?? null,
          fechafundacion: createMinisterioDto.fechaFundacion ?? null
        }
      })
      return newMinisterio
    } catch (error) {
      throw CustomError.internalServer('An error occurred while creating the Ministry.')
    }
  }

  // Actualizar un Ministerio
  public async updateMinisterio (
    updateMinisterioDto: UpdateMinisterioDto
  ): Promise<any> {
    const ministerioExists = await this.getMinisterioById(updateMinisterioDto.id)
    if (!ministerioExists) {
      throw CustomError.badRequest('The requested Ministry to update was not found.')
    }

    try {
      const updatedMinisterio = await prisma.ministerio.update({
        where: { id_ministerio: updateMinisterioDto.id },
        data: { ...updateMinisterioDto.values }
      })
      return updatedMinisterio
    } catch (error) {
      throw CustomError.internalServer('An error occurred while updating the Ministry.')
    }
  }

  // Eliminar un Ministerio
  public async deleteMinisterio (id: number): Promise<any> {
    const ministerioExists = await this.getMinisterioById(id)
    if (!ministerioExists) {
      throw CustomError.badRequest('The requested Ministry to delete was not found.')
    }
    try {
      await prisma.ministerio.delete({
        where: { id_ministerio: id }
      })
      return { message: 'Ministry successfully deleted' }
    } catch (error) {
      throw CustomError.internalServer('An error occurred while deleting the Ministry.')
    }
  }
}

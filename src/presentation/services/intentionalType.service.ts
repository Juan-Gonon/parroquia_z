/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { prisma } from '../../data/postgress'
import { CustomError, PaginationDto } from '../../domain'
import { CreateTipoIntencionDto } from '../../domain/DTOs/intentionalType/CreateIntentional.dto'
import { UpdateTipoIntencionDto } from '../../domain/DTOs/intentionalType/UpdateIntentional.dto'

export class TipoIntencionService {
  // Obtener un TipoIntencion por su nombre
  public async getTipoIntencionByName (nombre: string): Promise<any | null> {
    const tipoIntencion = await prisma.tipointencion.findFirst({
      where: { nombre }
    })
    return tipoIntencion
  }

  // Obtener un TipoIntencion por su ID
  public async getTipoIntencionById (id: number): Promise<any> {
    const tipoIntencion = await prisma.tipointencion.findUnique({
      where: { id_tipointencion: id }
    })
    if (tipoIntencion == null) {
      throw CustomError.badRequest('The requested Type of Intention was not found.')
    }
    return tipoIntencion
  }

  // Obtener todos los Tipos de Intencion con paginación
  public async getAllTipoIntenciones (
    paginationDto: PaginationDto
  ): Promise<any> {
    const { page, limit } = paginationDto

    try {
      const [total, tiposIntencion] = await prisma.$transaction([
        prisma.tipointencion.count(),
        prisma.tipointencion.findMany({
          skip: (page - 1) * limit,
          take: limit
        })
      ])

      return {
        page,
        limit,
        total,
        next: (page * limit) < total ? `/api/intentional-type?page=${page + 1}&limit=${limit}` : null,
        prev: (page - 1 > 0) ? `/api/intentional-type?page=${page - 1}&limit=${limit}` : null,
        data: tiposIntencion
      }
    } catch (error) {
      throw CustomError.internalServer('An error occurred while retrieving the data.')
    }
  }

  // Crear un nuevo TipoIntencion
  public async createTipoIntencion (
    createTipoIntencionDto: CreateTipoIntencionDto
  ): Promise<any> {
    const tipoIntencionExists = await this.getTipoIntencionByName(createTipoIntencionDto.nombre)
    if (tipoIntencionExists) {
      throw CustomError.badRequest('A Type of Intention with that name already exists.')
    }
    try {
      const newTipoIntencion = await prisma.tipointencion.create({
        data: {
          nombre: createTipoIntencionDto.nombre,
          descripcion: createTipoIntencionDto.descripcion ?? null
        }
      })
      return newTipoIntencion
    } catch (error) {
      throw CustomError.internalServer('An error occurred while creating the Type of Intention.')
    }
  }

  // Actualizar un TipoIntencion
  public async updateTipoIntencion (
    updateTipoIntencionDto: UpdateTipoIntencionDto
  ): Promise<any> {
    const tipoIntencionExists = await this.getTipoIntencionById(updateTipoIntencionDto.id)
    if (!tipoIntencionExists) {
      throw CustomError.badRequest('The requested Type of Intention to update was not found.')
    }

    try {
      const updatedTipoIntencion = await prisma.tipointencion.update({
        where: { id_tipointencion: updateTipoIntencionDto.id },
        data: { ...updateTipoIntencionDto.values }
      })
      return updatedTipoIntencion
    } catch (error) {
      throw CustomError.internalServer('An error occurred while updating the Type of Intention.')
    }
  }

  // Eliminar un TipoIntencion
  public async deleteTipoIntencion (id: number): Promise<any> {
    const tipoIntencionExists = await this.getTipoIntencionById(id)
    if (!tipoIntencionExists) {
      throw CustomError.badRequest('The requested Type of Intention to delete was not found.')
    }
    try {
      await prisma.tipointencion.delete({
        where: { id_tipointencion: id }
      })
      return { message: 'Type of Intention successfully deleted' }
    } catch (error) {
      throw CustomError.internalServer('An error occurred while deleting the Type of Intention.')
    }
  }
}

/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { prisma } from '../../data/postgress'
import { CreateTipoEventoDto, CustomError, PaginationDto, UpdateTipoEventoDto } from '../../domain'

// Se instancia PrismaClient para las operaciones de base de datos

// Clase de servicio para la lógica de negocio de TipoEvento
export class TipoEventoService {
  // Obtener un TipoEvento por su nombre
  public async getTipoEventoByName (nombre: string): Promise<any | null> {
    const tipoEvento = await prisma.tipoevento.findFirst({
      where: { nombre }
    })
    return tipoEvento
  }

  // Obtener un TipoEvento por su ID
  public async getTipoEventoById (id: number): Promise<any> {
    const tipoEvento = await prisma.tipoevento.findUnique({
      where: { id_tipo: id }
    })
    if (tipoEvento == null) {
      throw CustomError.badRequest('The requested Type of Event was not found.')
    }
    return tipoEvento
  }

  // Obtener todos los Tipos de Evento con paginación
  public async getAllTipoEventos (
    paginationDto: PaginationDto
  ): Promise<any> {
    const { page, limit } = paginationDto

    try {
      const [total, tiposEvento] = await prisma.$transaction([
        prisma.tipoevento.count(),
        prisma.tipoevento.findMany({
          skip: (page - 1) * limit,
          take: limit
        })
      ])

      return {
        page,
        limit,
        total,
        next: (page * limit) < total ? `/api/event-type?page=${page + 1}&limit=${limit}` : null,
        prev: (page - 1 > 0) ? `/api/event-type?page=${page - 1}&limit=${limit}` : null,
        data: tiposEvento
      }
    } catch (error) {
      throw CustomError.internalServer('An error occurred while retrieving the data.')
    }
  }

  // Crear un nuevo TipoEvento
  public async createTipoEvento (
    createTipoEventoDto: CreateTipoEventoDto
  ): Promise<any> {
    const tipoEventoExists = await this.getTipoEventoByName(createTipoEventoDto.nombre)
    if (tipoEventoExists) {
      throw CustomError.badRequest('A Type of Event with that name already exists.')
    }
    try {
      const newTipoEvento = await prisma.tipoevento.create({
        data: {
          nombre: createTipoEventoDto.nombre,
          descripcion: createTipoEventoDto.descripcion ?? null
        }
      })
      return newTipoEvento
    } catch (error) {
      throw CustomError.internalServer('An error occurred while creating the Type of Event.')
    }
  }

  // Actualizar un TipoEvento
  public async updateTipoEvento (
    updateTipoEventoDto: UpdateTipoEventoDto
  ): Promise<any> {
    const tipoEventoExists = await this.getTipoEventoById(updateTipoEventoDto.id)
    if (!tipoEventoExists) {
      throw CustomError.badRequest('The requested Type of Event to update was not found.')
    }

    try {
      const updatedTipoEvento = await prisma.tipoevento.update({
        where: { id_tipo: updateTipoEventoDto.id },
        data: { ...updateTipoEventoDto.values }
      })
      return updatedTipoEvento
    } catch (error) {
      throw CustomError.internalServer('An error occurred while updating the Type of Event.')
    }
  }

  // Eliminar un TipoEvento
  public async deleteTipoEvento (id: number): Promise<any> {
    const tipoEventoExists = await this.getTipoEventoById(id)
    if (!tipoEventoExists) {
      throw CustomError.badRequest('The requested Type of Event to delete was not found.')
    }
    try {
      await prisma.tipoevento.delete({
        where: { id_tipo: id }
      })
      return { message: 'Type of Event successfully deleted' }
    } catch (error) {
      throw CustomError.internalServer('An error occurred while deleting the Type of Event.')
    }
  }
}

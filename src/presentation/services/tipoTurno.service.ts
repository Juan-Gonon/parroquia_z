/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { prisma } from '../../data/postgress'
import { CustomError, PaginationDto } from '../../domain'
import { CreateTipoTurnoDto, UpdateTipoTurnoDto } from '../../domain/DTOs'

export class TipoTurnoService {
  // Obtener un TipoTurno por su nombre
  public async getTipoTurnoByName (nombre: string): Promise<any | null> {
    const tipoTurno = await prisma.tipoturno.findFirst({
      where: { nombre }
    })
    return tipoTurno
  }

  // Obtener un TipoTurno por su ID
  public async getTipoTurnoById (id: number): Promise<any> {
    const tipoTurno = await prisma.tipoturno.findUnique({
      where: { id_tipo: id }
    })
    if (tipoTurno == null) {
      throw CustomError.badRequest('The requested Type of Shift was not found.')
    }
    return tipoTurno
  }

  // Obtener todos los Tipos de Turno con paginación
  public async getAllTipoTurnos (
    paginationDto: PaginationDto
  ): Promise<any> {
    const { page, limit } = paginationDto

    try {
      const [total, tiposTurno] = await prisma.$transaction([
        prisma.tipoturno.count(),
        prisma.tipoturno.findMany({
          skip: (page - 1) * limit,
          take: limit
        })
      ])

      return {
        page,
        limit,
        total,
        next: (page * limit) < total ? `/api/tipos-turno?page=${page + 1}&limit=${limit}` : null,
        prev: (page - 1 > 0) ? `/api/tipos-turno?page=${page - 1}&limit=${limit}` : null,
        data: tiposTurno
      }
    } catch (error) {
      throw CustomError.internalServer('An error occurred while retrieving the data.')
    }
  }

  // Crear un nuevo TipoTurno
  public async createTipoTurno (
    createTipoTurnoDto: CreateTipoTurnoDto
  ): Promise<any> {
    const tipoTurnoExists = await this.getTipoTurnoByName(createTipoTurnoDto.nombre)
    if (tipoTurnoExists) {
      throw CustomError.badRequest('A Type of Shift with that name already exists.')
    }
    try {
      const newTipoTurno = await prisma.tipoturno.create({
        data: {
          nombre: createTipoTurnoDto.nombre,
          descripcion: createTipoTurnoDto.descripcion ?? null
        }
      })
      return newTipoTurno
    } catch (error) {
      throw CustomError.internalServer('An error occurred while creating the Type of Shift.')
    }
  }

  // Actualizar un TipoTurno
  public async updateTipoTurno (
    updateTipoTurnoDto: UpdateTipoTurnoDto
  ): Promise<any> {
    const tipoTurnoExists = await this.getTipoTurnoById(updateTipoTurnoDto.id)
    if (!tipoTurnoExists) {
      throw CustomError.badRequest('The requested Type of Shift to update was not found.')
    }

    try {
      const updatedTipoTurno = await prisma.tipoturno.update({
        where: { id_tipo: updateTipoTurnoDto.id },
        data: { ...updateTipoTurnoDto.values }
      })
      return updatedTipoTurno
    } catch (error) {
      throw CustomError.internalServer('An error occurred while updating the Type of Shift.')
    }
  }

  // Eliminar un TipoTurno
  public async deleteTipoTurno (id: number): Promise<any> {
    const tipoTurnoExists = await this.getTipoTurnoById(id)
    if (!tipoTurnoExists) {
      throw CustomError.badRequest('The requested Type of Shift to delete was not found.')
    }
    try {
      await prisma.tipoturno.delete({
        where: { id_tipo: id }
      })
      return { message: 'Type of Shift successfully deleted' }
    } catch (error) {
      throw CustomError.internalServer('An error occurred while deleting the Type of Shift.')
    }
  }
}

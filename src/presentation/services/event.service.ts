/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { prisma } from '../../data/postgress'
import { CustomError, PaginationDto } from '../../domain'
import { CreateEventoDto } from '../../domain/DTOs/event/CreateEvent.dto'
import { UpdateEventoDto } from '../../domain/DTOs/event/UpdateEvent.dto'

export class EventoService {
  // Obtener un registro de evento por su ID
  public async getEventById (id: number): Promise<any> {
    const event = await prisma.evento.findUnique({
      where: { id_evento: id }
    })
    if (!event) {
      throw CustomError.badRequest('The requested event was not found.')
    }
    return event
  }

  // Obtener todos los eventos con paginación
  public async getAllEvents (paginationDto: PaginationDto): Promise<any> {
    const { page, limit } = paginationDto

    try {
      const [total, events] = await prisma.$transaction([
        prisma.evento.count(),
        prisma.evento.findMany({
          skip: (page - 1) * limit,
          take: limit
        })
      ])

      return {
        page,
        limit,
        total,
        next: (page * limit) < total ? `/api/event?page=${page + 1}&limit=${limit}` : null,
        prev: (page - 1 > 0) ? `/api/event?page=${page - 1}&limit=${limit}` : null,
        data: events
      }
    } catch (error) {
      throw CustomError.internalServer('An error occurred while retrieving the data.')
    }
  }

  // Crear un nuevo evento
  public async createEvent (
    createEventoDto: CreateEventoDto
  ): Promise<any> {
    // Verificar si las relaciones (Comunidad, TipoEvento) existen
    const comunidadExists = await prisma.comunidad.findUnique({ where: { id_comunidad: createEventoDto.idComunidad } })
    if (!comunidadExists) {
      throw CustomError.badRequest('The specified community does not exist.')
    }

    const tipoEventoExists = await prisma.tipoevento.findUnique({ where: { id_tipo: createEventoDto.idTipoEvento } })
    if (!tipoEventoExists) {
      throw CustomError.badRequest('The specified event type does not exist.')
    }

    // Validar si el celebrante existe si se proporciona un id_celebrante
    if (createEventoDto.idCelebrante) {
      const celebranteExists = await prisma.personalparroquial.findUnique({ where: { id_personal: createEventoDto.idCelebrante } })
      if (!celebranteExists) {
        throw CustomError.badRequest('The specified celebrant does not exist.')
      }
    }

    try {
      const newEvent = await prisma.evento.create({
        data: {
          nombre: createEventoDto.nombre,
          fecha_ini: createEventoDto.fechaIni,
          fecha_fin: createEventoDto.fechaFin ?? null,
          descripcion: createEventoDto.descripcion ?? null,
          id_comunidad: createEventoDto.idComunidad,
          id_tipoevento: createEventoDto.idTipoEvento,
          aceptaintenciones: createEventoDto.aceptaIntenciones ?? false,
          requiereinscripcion: createEventoDto.requiereInscripcion ?? false,
          id_celebrante: createEventoDto.idCelebrante ?? null,
          nombrecelebranteexterno: createEventoDto.nombreCelebranteExterno ?? null
        }
      })
      return newEvent
    } catch (error) {
      throw CustomError.internalServer('An error occurred while creating the event.')
    }
  }

  // Actualizar un evento
  public async updateEvent (
    updateEventoDto: UpdateEventoDto
  ): Promise<any> {
    const eventExists = await this.getEventById(updateEventoDto.id)
    if (!eventExists) {
      throw CustomError.badRequest('The requested event to update was not found.')
    }

    // Validar las relaciones si se están actualizando
    if (updateEventoDto.idComunidad) {
      const comunidadExists = await prisma.comunidad.findUnique({ where: { id_comunidad: updateEventoDto.idComunidad } })
      if (!comunidadExists) {
        throw CustomError.badRequest('The specified community does not exist.')
      }
    }

    if (updateEventoDto.idTipoEvento) {
      const tipoEventoExists = await prisma.tipoevento.findUnique({ where: { id_tipo: updateEventoDto.idTipoEvento } })
      if (!tipoEventoExists) {
        throw CustomError.badRequest('The specified event type does not exist.')
      }
    }

    if (updateEventoDto.idCelebrante) {
      const celebranteExists = await prisma.personalparroquial.findUnique({ where: { id_personal: updateEventoDto.idCelebrante } })
      if (!celebranteExists) {
        throw CustomError.badRequest('The specified celebrant does not exist.')
      }
    }

    try {
      const updatedEvent = await prisma.evento.update({
        where: { id_evento: updateEventoDto.id },
        data: updateEventoDto.values
      })
      return updatedEvent
    } catch (error) {
      throw CustomError.internalServer('An error occurred while updating the event.')
    }
  }

  // Eliminar un evento
  public async deleteEvent (id: number): Promise<any> {
    const eventExists = await this.getEventById(id)
    if (!eventExists) {
      throw CustomError.badRequest('The requested event to delete was not found.')
    }
    try {
      await prisma.evento.delete({
        where: { id_evento: id }
      })
      return { message: 'Event successfully deleted' }
    } catch (error) {
      throw CustomError.internalServer('An error occurred while deleting the event.')
    }
  }
}

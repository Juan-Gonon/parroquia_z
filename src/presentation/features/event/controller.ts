/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { Request, Response } from 'express'
import { CustomError, handleError, PaginationDto } from '../../../domain'
import { CreateEventoDto } from '../../../domain/DTOs/event/CreateEvent.dto'
import { UpdateEventoDto } from '../../../domain/DTOs/event/UpdateEvent.dto'
import { EventoService } from '../../services/event.service'

export class EventoController {
  constructor (private readonly eventoService: EventoService) {}

  // Obtener todos los eventos con paginación
  public getAllEvents = async (req: Request, res: Response): Promise<Response> => {
    const { page = 1, limit = 10 } = req.query

    const [error, paginationDTO] = PaginationDto.create(+page, +limit)
    if (error) return handleError(CustomError.badRequest(error), res)

    try {
      const events = await this.eventoService.getAllEvents(paginationDTO!)
      return res.status(200).json(events)
    } catch (error) {
      return handleError(error, res)
    }
  }

  // Obtener un evento por su ID
  public getEventById = async (req: Request, res: Response): Promise<Response> => {
    const eventId = +req.params.id!

    if (isNaN(eventId)) { return handleError(CustomError.badRequest('The id contains invalid characters'), res) }

    try {
      const event = await this.eventoService.getEventById(eventId)
      return res.status(200).json(event)
    } catch (error) {
      return handleError(error, res)
    }
  }

  // Crear un nuevo evento
  public createEvent = async (req: Request, res: Response): Promise<Response> => {
    const [error, createDto] = CreateEventoDto.create(req.body)
    if (error) return handleError(CustomError.badRequest(error), res)

    try {
      const newEvent = await this.eventoService.createEvent(createDto!)
      return res.status(200).json(newEvent)
    } catch (error) {
      return handleError(error, res)
    }
  }

  // Actualizar un evento
  public updateEvent = async (req: Request, res: Response): Promise<Response> => {
    const [error, updateDto] = UpdateEventoDto.update({ ...req.body, id: req.params.id })
    if (error) return handleError(CustomError.badRequest(error), res)

    try {
      const updatedEvent = await this.eventoService.updateEvent(updateDto!)
      return res.status(200).json(updatedEvent)
    } catch (error) {
      return handleError(error, res)
    }
  }

  // Eliminar un evento
  public deleteEvent = async (req: Request, res: Response): Promise<Response> => {
    const eventId = +req.params.id!

    if (isNaN(eventId)) { return handleError(CustomError.badRequest('The id contains invalid characters'), res) }

    try {
      const response = await this.eventoService.deleteEvent(eventId)
      return res.status(200).json(response)
    } catch (error) {
      return handleError(error, res)
    }
  }
}

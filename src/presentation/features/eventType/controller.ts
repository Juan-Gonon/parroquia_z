/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { Request, Response } from 'express'
import { CustomError, handleError, PaginationDto } from '../../../domain'
import { CreateTipoEventoDto } from '../../../domain/DTOs/eventType/CreateEventType.dto'
import { UpdateTipoEventoDto } from '../../../domain/DTOs/eventType/UpdateEventType.dto'
import { TipoEventoService } from '../../services/eventType.service'

// Clase que contiene la lógica del controlador para TipoEvento
export class TipoEventoController {
  constructor (private readonly tipoEventoService: TipoEventoService) {}

  // Obtener todos los tipos de evento
  public getAllTipoEventos = async (req: Request, res: Response): Promise<Response> => {
    const { page = 1, limit = 10 } = req.query

    const [error, paginationDTO] = PaginationDto.create(+page, +limit)
    if (error) return handleError(CustomError.badRequest(error), res)

    try {
      const tiposEvento = await this.tipoEventoService.getAllTipoEventos(paginationDTO!)
      return res.status(200).json(tiposEvento)
    } catch (error) {
      return handleError(error, res)
    }
  }

  // Obtener un tipo de evento por su ID
  public getTipoEventoById = async (req: Request, res: Response): Promise<Response> => {
    const tipoEventoID = +req.params.id!

    if (isNaN(tipoEventoID)) { return handleError(CustomError.badRequest('The id contains invalid characters'), res) }

    try {
      const tipoEvento = await this.tipoEventoService.getTipoEventoById(tipoEventoID)
      return res.status(200).json(tipoEvento)
    } catch (error) {
      return handleError(error, res)
    }
  }

  // Crear un nuevo tipo de evento
  public createTipoEvento = async (req: Request, res: Response): Promise<Response> => {
    const [error, createDto] = CreateTipoEventoDto.create(req.body)
    if (error) return handleError(CustomError.badRequest(error), res)

    try {
      const tipoEvento = await this.tipoEventoService.createTipoEvento(createDto!)
      return res.status(200).json(tipoEvento)
    } catch (error) {
      return handleError(error, res)
    }
  }

  // Actualizar un tipo de evento
  public updateTipoEvento = async (req: Request, res: Response): Promise<Response> => {
    const [error, updateDto] = UpdateTipoEventoDto.update({ ...req.body, id: req.params.id })
    if (error) return handleError(CustomError.badRequest(error), res)

    try {
      const tipoEvento = await this.tipoEventoService.updateTipoEvento(updateDto!)
      return res.status(200).json(tipoEvento)
    } catch (error) {
      return handleError(error, res)
    }
  }

  // Eliminar un tipo de evento
  public deleteTipoEvento = async (req: Request, res: Response): Promise<Response> => {
    const tipoEventoID = +req.params.id!

    if (isNaN(tipoEventoID)) { return handleError(CustomError.badRequest('The id contains invalid characters'), res) }

    try {
      const response = await this.tipoEventoService.deleteTipoEvento(tipoEventoID)
      return res.status(200).json(response)
    } catch (error) {
      return handleError(error, res)
    }
  }
}

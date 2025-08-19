/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { Request, Response } from 'express'
import { CustomError, handleError, PaginationDto } from '../../../domain'
import { CreateTipoIntencionDto } from '../../../domain/DTOs/intentionalType/CreateIntentional.dto'
import { UpdateTipoIntencionDto } from '../../../domain/DTOs/intentionalType/UpdateIntentional.dto'
import { TipoIntencionService } from '../../services/intentionalType.service'

// Clase que contiene la lógica del controlador para TipoIntencion
export class TipoIntencionController {
  constructor (private readonly tipoIntencionService: TipoIntencionService) {}

  // Obtener todos los tipos de intención
  public getAllTipoIntenciones = async (req: Request, res: Response): Promise<Response> => {
    const { page = 1, limit = 10 } = req.query

    const [error, paginationDTO] = PaginationDto.create(+page, +limit)
    if (error) return handleError(CustomError.badRequest(error), res)

    try {
      const tiposIntencion = await this.tipoIntencionService.getAllTipoIntenciones(paginationDTO!)
      return res.status(200).json(tiposIntencion)
    } catch (error) {
      return handleError(error, res)
    }
  }

  // Obtener un tipo de intención por su ID
  public getTipoIntencionById = async (req: Request, res: Response): Promise<Response> => {
    const tipoIntencionID = +req.params.id!

    if (isNaN(tipoIntencionID)) { return handleError(CustomError.badRequest('The id contains invalid characters'), res) }

    try {
      const tipoIntencion = await this.tipoIntencionService.getTipoIntencionById(tipoIntencionID)
      return res.status(200).json(tipoIntencion)
    } catch (error) {
      return handleError(error, res)
    }
  }

  // Crear un nuevo tipo de intención
  public createTipoIntencion = async (req: Request, res: Response): Promise<Response> => {
    const [error, createDto] = CreateTipoIntencionDto.create(req.body)
    if (error) return handleError(CustomError.badRequest(error), res)

    try {
      const tipoIntencion = await this.tipoIntencionService.createTipoIntencion(createDto!)
      return res.status(200).json(tipoIntencion)
    } catch (error) {
      return handleError(error, res)
    }
  }

  // Actualizar un tipo de intención
  public updateTipoIntencion = async (req: Request, res: Response): Promise<Response> => {
    const [error, updateDto] = UpdateTipoIntencionDto.update({ ...req.body, id: req.params.id })
    if (error) return handleError(CustomError.badRequest(error), res)

    try {
      const tipoIntencion = await this.tipoIntencionService.updateTipoIntencion(updateDto!)
      return res.status(200).json(tipoIntencion)
    } catch (error) {
      return handleError(error, res)
    }
  }

  // Eliminar un tipo de intención
  public deleteTipoIntencion = async (req: Request, res: Response): Promise<Response> => {
    const tipoIntencionID = +req.params.id!

    if (isNaN(tipoIntencionID)) { return handleError(CustomError.badRequest('The id contains invalid characters'), res) }

    try {
      const response = await this.tipoIntencionService.deleteTipoIntencion(tipoIntencionID)
      return res.status(200).json(response)
    } catch (error) {
      return handleError(error, res)
    }
  }
}

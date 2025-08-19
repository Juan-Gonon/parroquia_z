/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { Request, Response } from 'express'
import { CreateMinisterioDto } from '../../../domain/DTOs/ministry/CreateMinistry.dto'
import { UpdateMinisterioDto } from '../../../domain/DTOs/ministry/UpdateMinistry.dto'
import { CustomError, handleError, PaginationDto } from '../../../domain'
import { MinisterioService } from '../../services/ministry.service'

// Clase que contiene la lógica del controlador para Ministerio
export class MinisterioController {
  constructor (private readonly ministerioService: MinisterioService) {}

  // Obtener todos los ministerios
  public getAllMinisterios = async (req: Request, res: Response): Promise<Response> => {
    const { page = 1, limit = 10 } = req.query

    const [error, paginationDTO] = PaginationDto.create(+page, +limit)
    if (error) return handleError(CustomError.badRequest(error), res)

    try {
      const ministerios = await this.ministerioService.getAllMinisterios(paginationDTO!)
      return res.status(200).json(ministerios)
    } catch (error) {
      return handleError(error, res)
    }
  }

  // Obtener un ministerio por su ID
  public getMinisterioById = async (req: Request, res: Response): Promise<Response> => {
    const ministerioID = +req.params.id!

    if (isNaN(ministerioID)) { return handleError(CustomError.badRequest('The id contains invalid characters'), res) }

    try {
      const ministerio = await this.ministerioService.getMinisterioById(ministerioID)
      return res.status(200).json(ministerio)
    } catch (error) {
      return handleError(error, res)
    }
  }

  // Crear un nuevo ministerio
  public createMinisterio = async (req: Request, res: Response): Promise<Response> => {
    const [error, createDto] = CreateMinisterioDto.create(req.body)
    if (error) return handleError(CustomError.badRequest(error), res)

    try {
      const ministerio = await this.ministerioService.createMinisterio(createDto!)
      return res.status(200).json(ministerio)
    } catch (error) {
      return handleError(error, res)
    }
  }

  // Actualizar un ministerio
  public updateMinisterio = async (req: Request, res: Response): Promise<Response> => {
    const [error, updateDto] = UpdateMinisterioDto.update({ ...req.body, id: req.params.id })
    if (error) return handleError(CustomError.badRequest(error), res)

    try {
      const ministerio = await this.ministerioService.updateMinisterio(updateDto!)
      return res.status(200).json(ministerio)
    } catch (error) {
      return handleError(error, res)
    }
  }

  // Eliminar un ministerio
  public deleteMinisterio = async (req: Request, res: Response): Promise<Response> => {
    const ministerioID = +req.params.id!

    if (isNaN(ministerioID)) { return handleError(CustomError.badRequest('The id contains invalid characters'), res) }

    try {
      const response = await this.ministerioService.deleteMinisterio(ministerioID)
      return res.status(200).json(response)
    } catch (error) {
      return handleError(error, res)
    }
  }
}

/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Request, Response } from 'express'
import { CustomError, handleError, PaginationDto } from '../../../domain'
import { CreateIntencionDto } from '../../../domain/DTOs/intention/CreateIntention.dto'
import { UpdateIntencionDto } from '../../../domain/DTOs/intention/UpdateIntention.dto'
import { IntencionService } from '../../services/intention.service'

export class IntencionController {
  constructor (
    private readonly service: IntencionService
  ) { }

  public readonly getAll = async (req: Request, res: Response): Promise<Response> => {
    const { page = 1, limit = 10 } = req.query

    const [error, paginationDTO] = PaginationDto.create(+page, +limit)
    if (error) return handleError(CustomError.badRequest(error), res)

    try {
      const intenciones = await this.service.getAllIntenciones(paginationDTO!)
      return res.status(200).json(intenciones)
    } catch (error) {
      return handleError(error, res)
    }
  }

  public readonly getById = async (req: Request, res: Response): Promise<Response> => {
    const id = +req.params.id!
    if (isNaN(id)) {
      return handleError(CustomError.badRequest('The id contains invalid characters'), res)
    }
    try {
      const intencion = await this.service.getIntencionById(id)
      return res.status(200).json(intencion)
    } catch (error) {
      return handleError(error, res)
    }
  }

  public readonly create = async (req: Request, res: Response): Promise<Response> => {
    const [error, createDto] = CreateIntencionDto.create(req.body)
    if (error) {
      return handleError(CustomError.badRequest(error), res)
    }
    try {
      const intencion = await this.service.createIntencion(createDto!)
      return res.status(200).json(intencion)
    } catch (error) {
      return handleError(error, res)
    }
  }

  public readonly update = async (req: Request, res: Response): Promise<Response> => {
    const [error, updateDto] = UpdateIntencionDto.update({ ...req.body, id: req.params.id })
    if (error) {
      return handleError(CustomError.badRequest(error), res)
    }
    try {
      const intencion = await this.service.updateIntencion(updateDto!)
      return res.status(200).json(intencion)
    } catch (error) {
      return handleError(error, res)
    }
  }

  public readonly delete = async (req: Request, res: Response): Promise<Response> => {
    const id = +req.params.id!
    if (isNaN(id)) {
      return handleError(CustomError.badRequest('The id contains invalid characters'), res)
    }
    try {
      const message = await this.service.deleteIntencion(id)
      return res.status(200).json(message)
    } catch (error) {
      return handleError(error, res)
    }
  }
}

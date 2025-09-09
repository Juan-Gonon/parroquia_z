/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Request, Response } from 'express'
import { CustomError, handleError, PaginationDto } from '../../../domain'
import { CreateFeligresDto } from '../../../domain/DTOs/feligres/CreateFeligres.dto'
import { UpdateFeligresDto } from '../../../domain/DTOs/feligres/UpdateFeligres.dto'
import { FeligresService } from '../../services/feligres.service'

export class FeligresController {
  constructor (
    private readonly service: FeligresService
  ) {}

  public readonly getAll = async (req: Request, res: Response): Promise<Response> => {
    const { page = 1, limit = 10 } = req.query

    const [error, paginationDTO] = PaginationDto.create(+page, +limit)
    if (error) return handleError(CustomError.badRequest(error), res)

    try {
      const feligreses = await this.service.getAllFeligreses(paginationDTO!)
      return res.status(200).json(feligreses)
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
      const feligres = await this.service.getFeligresById(id)
      return res.status(200).json(feligres)
    } catch (error) {
      return handleError(error, res)
    }
  }

  public readonly create = async (req: Request, res: Response): Promise<Response> => {
    const [error, createDto] = CreateFeligresDto.create(req.body)
    if (error) {
      return handleError(CustomError.badRequest(error), res)
    }
    try {
      const feligres = await this.service.createFeligres(createDto!)
      return res.status(201).json(feligres)
    } catch (error) {
      return handleError(error, res)
    }
  }

  public readonly update = async (req: Request, res: Response): Promise<Response> => {
    const [error, updateDto] = UpdateFeligresDto.update({ ...req.body, id: req.params.id })
    if (error) {
      return handleError(CustomError.badRequest(error), res)
    }
    try {
      const feligres = await this.service.updateFeligres(updateDto!)
      return res.status(200).json(feligres)
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
      const message = await this.service.deleteFeligres(id)
      return res.status(200).json(message)
    } catch (error) {
      return handleError(error, res)
    }
  }
}

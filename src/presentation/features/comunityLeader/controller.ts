/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Request, Response } from 'express'
import { CustomError } from '../../../domain/errors/custom.error'
import { handleError, PaginationDto } from '../../../domain'
import { CreateLiderComunitarioDto } from '../../../domain/DTOs/comunityLeader/CreateComunityLeader.dto'
import { UpdateLiderComunitarioDto } from '../../../domain/DTOs/comunityLeader/UpdateComunityLeader.dto'
import { LiderComunitarioService } from '../../services/comunityLeader.service'

export class LiderComunitarioController {
  constructor (
    private readonly liderComunitarioService: LiderComunitarioService
  ) {}

  public readonly getAllLideres = async (req: Request, res: Response): Promise<Response> => {
    const { page = 1, limit = 10 } = req.query

    const [error, paginationDTO] = PaginationDto.create(+page, +limit)
    if (error) return handleError(CustomError.badRequest(error), res)

    try {
      const lideres = await this.liderComunitarioService.getAllLideres(paginationDTO!)
      return res.status(200).json(lideres)
    } catch (error) {
      return handleError(error, res)
    }
  }

  public readonly getLiderById = async (req: Request, res: Response): Promise<Response> => {
    const liderId = +req.params.id!

    if (isNaN(liderId)) {
      return handleError(CustomError.badRequest('The id contains invalid characters'), res)
    }

    try {
      const lider = await this.liderComunitarioService.getLiderById(liderId)
      return res.status(200).json(lider)
    } catch (error) {
      return handleError(error, res)
    }
  }

  public readonly createLider = async (req: Request, res: Response): Promise<Response> => {
    const [error, createLiderDto] = CreateLiderComunitarioDto.create(req.body)
    if (error) {
      return handleError(CustomError.badRequest(error), res)
    }

    try {
      const lider = await this.liderComunitarioService.createLider(createLiderDto!)
      return res.status(201).json(lider)
    } catch (error) {
      return handleError(error, res)
    }
  }

  public readonly updateLider = async (req: Request, res: Response): Promise<Response> => {
    const [error, updateLiderDto] = UpdateLiderComunitarioDto.update({ ...req.body, id: req.params.id })

    if (error) {
      return handleError(CustomError.badRequest(error), res)
    }

    try {
      const lider = await this.liderComunitarioService.updateLider(updateLiderDto!)
      return res.status(200).json(lider)
    } catch (error) {
      return handleError(error, res)
    }
  }

  public readonly deleteLider = async (req: Request, res: Response): Promise<Response> => {
    const liderId = +req.params.id!

    if (isNaN(liderId)) {
      return handleError(CustomError.badRequest('The id contains invalid characters'), res)
    }

    try {
      const message = await this.liderComunitarioService.deleteLider(liderId)
      return res.status(200).json(message)
    } catch (error) {
      return handleError(error, res)
    }
  }
}

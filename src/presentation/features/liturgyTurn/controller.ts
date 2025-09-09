/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Request, Response } from 'express'
import { CustomError, handleError, PaginationDto } from '../../../domain'
import { CreateTurnoLiturgicoComunitarioDto } from '../../../domain/DTOs/liturgyTurn/CreateLiturgyTurn.dto'
import { UpdateTurnoLiturgicoComunitarioDto } from '../../../domain/DTOs/liturgyTurn/UpdateLiturgyTurn.dto'
import { TurnoLiturgicoComunitarioService } from '../../services/liturgyTurn.service'

export class TurnoLiturgicoComunitarioController {
  constructor (
    private readonly service: TurnoLiturgicoComunitarioService
  ) {}

  public readonly getAll = async (req: Request, res: Response): Promise<Response> => {
    const { page = 1, limit = 10 } = req.query

    const [error, paginationDTO] = PaginationDto.create(+page, +limit)
    if (error) return handleError(CustomError.badRequest(error), res)

    try {
      const turnos = await this.service.getAllTurnos(paginationDTO!)
      return res.status(200).json(turnos)
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
      const turno = await this.service.getTurnoById(id)
      return res.status(200).json(turno)
    } catch (error) {
      return handleError(error, res)
    }
  }

  public readonly create = async (req: Request, res: Response): Promise<Response> => {
    const [error, createDto] = CreateTurnoLiturgicoComunitarioDto.create(req.body)
    if (error) {
      return handleError(CustomError.badRequest(error), res)
    }
    try {
      const turno = await this.service.createTurno(createDto!)
      return res.status(201).json(turno)
    } catch (error) {
      return handleError(error, res)
    }
  }

  public readonly update = async (req: Request, res: Response): Promise<Response> => {
    const [error, updateDto] = UpdateTurnoLiturgicoComunitarioDto.update({ ...req.body, id: req.params.id })
    if (error) {
      return handleError(CustomError.badRequest(error), res)
    }
    try {
      const turno = await this.service.updateTurno(updateDto!)
      return res.status(200).json(turno)
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
      const message = await this.service.deleteTurno(id)
      return res.status(200).json({ message })
    } catch (error) {
      return handleError(error, res)
    }
  }
}

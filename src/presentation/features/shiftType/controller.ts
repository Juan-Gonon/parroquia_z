/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { Request, Response } from 'express'
import { CustomError, handleError, PaginationDto } from '../../../domain'
import { TipoTurnoService } from '../../services/tipoTurno.service'
import { CreateTipoTurnoDto } from '../../../domain/DTOs/tipoturnos/CreateTipoTurnoDto'
import { UpdateTipoTurnoDto } from '../../../domain/DTOs/tipoturnos/UpdateTipoTurnoDto'

export class TipoTurnoController {
  constructor (private readonly tipoTurnoService: TipoTurnoService) {}

  // Obtener todos los tipos de turno
  public getAllTipoTurnos = async (req: Request, res: Response): Promise<Response> => {
    const { page = 1, limit = 10 } = req.query

    const [error, paginationDTO] = PaginationDto.create(+page, +limit)
    if (error) return handleError(CustomError.badRequest(error), res)

    try {
      const tiposTurno = await this.tipoTurnoService.getAllTipoTurnos(paginationDTO!)
      return res.status(200).json(tiposTurno)
    } catch (error) {
      return handleError(error, res)
    }
  }

  // Obtener un tipo de turno por su ID
  public getTipoTurnoById = async (req: Request, res: Response): Promise<Response> => {
    const tipoTurnoID = +req.params.id!

    if (isNaN(tipoTurnoID)) { return handleError(CustomError.badRequest('The id contains invalid characters'), res) }

    try {
      const tipoTurno = await this.tipoTurnoService.getTipoTurnoById(tipoTurnoID)
      return res.status(200).json(tipoTurno)
    } catch (error) {
      return handleError(error, res)
    }
  }

  // Crear un nuevo tipo de turno
  public createTipoTurno = async (req: Request, res: Response): Promise<Response> => {
    const [error, createDto] = CreateTipoTurnoDto.create(req.body)
    if (error) return handleError(CustomError.badRequest(error), res)

    try {
      const tipoTurno = await this.tipoTurnoService.createTipoTurno(createDto!)
      return res.status(200).json(tipoTurno)
    } catch (error) {
      return handleError(error, res)
    }
  }

  // Actualizar un tipo de turno
  public updateTipoTurno = async (req: Request, res: Response): Promise<Response> => {
    const [error, updateDto] = UpdateTipoTurnoDto.update({ ...req.body, id: req.params.id })
    if (error) return handleError(CustomError.badRequest(error), res)

    try {
      const tipoTurno = await this.tipoTurnoService.updateTipoTurno(updateDto!)
      return res.status(200).json(tipoTurno)
    } catch (error) {
      return handleError(error, res)
    }
  }

  // Eliminar un tipo de turno
  public deleteTipoTurno = async (req: Request, res: Response): Promise<Response> => {
    const tipoTurnoID = +req.params.id!

    if (isNaN(tipoTurnoID)) { return handleError(CustomError.badRequest('The id contains invalid characters'), res) }

    try {
      const response = await this.tipoTurnoService.deleteTipoTurno(tipoTurnoID)
      return res.status(200).json(response)
    } catch (error) {
      return handleError(error, res)
    }
  }
}

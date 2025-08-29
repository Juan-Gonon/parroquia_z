/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { Request, Response } from 'express'
import { CustomError, handleError, PaginationDto } from '../../../domain'
import { CreateParticipacionDto } from '../../../domain/DTOs/MinistryPart/CreateMinistryP.dto'
import { UpdateParticipacionDto } from '../../../domain/DTOs/MinistryPart/UpdateMinistry.dto'
import { ParticipacionMinisterioService } from '../../services/ministryP.service'

export class ParticipacionMinisterioController {
  constructor (private readonly participacionMinisterioService: ParticipacionMinisterioService) {}

  // Obtener todas las participaciones de ministerio con paginación
  public getAllParticipaciones = async (req: Request, res: Response): Promise<Response> => {
    const { page = 1, limit = 10 } = req.query

    const [error, paginationDTO] = PaginationDto.create(+page, +limit)
    if (error) return handleError(CustomError.badRequest(error), res)

    try {
      const participaciones = await this.participacionMinisterioService.getAllParticipaciones(paginationDTO!)
      return res.status(200).json(participaciones)
    } catch (error) {
      return handleError(error, res)
    }
  }

  // Obtener una participación de ministerio por su ID
  public getParticipacionById = async (req: Request, res: Response): Promise<Response> => {
    const participacionId = +req.params.id!

    if (isNaN(participacionId)) { return handleError(CustomError.badRequest('The id contains invalid characters'), res) }

    try {
      const participacion = await this.participacionMinisterioService.getParticipacionById(participacionId)
      return res.status(200).json(participacion)
    } catch (error) {
      return handleError(error, res)
    }
  }

  // Crear una nueva participación de ministerio
  public createParticipacion = async (req: Request, res: Response): Promise<Response> => {
    const [error, createDto] = CreateParticipacionDto.create(req.body)
    if (error) return handleError(CustomError.badRequest(error), res)

    try {
      const newParticipacion = await this.participacionMinisterioService.createParticipacion(createDto!)
      return res.status(200).json(newParticipacion)
    } catch (error) {
      return handleError(error, res)
    }
  }

  // Actualizar una participación de ministerio
  public updateParticipacion = async (req: Request, res: Response): Promise<Response> => {
    const [error, updateDto] = UpdateParticipacionDto.update({ ...req.body, id: req.params.id })
    if (error) return handleError(CustomError.badRequest(error), res)

    try {
      const updatedParticipacion = await this.participacionMinisterioService.updateParticipacion(updateDto!)
      return res.status(200).json(updatedParticipacion)
    } catch (error) {
      return handleError(error, res)
    }
  }

  // Eliminar una participación de ministerio
  public deleteParticipacion = async (req: Request, res: Response): Promise<Response> => {
    const participacionId = +req.params.id!

    if (isNaN(participacionId)) { return handleError(CustomError.badRequest('The id contains invalid characters'), res) }

    try {
      const response = await this.participacionMinisterioService.deleteParticipacion(participacionId)
      return res.status(200).json(response)
    } catch (error) {
      return handleError(error, res)
    }
  }
}

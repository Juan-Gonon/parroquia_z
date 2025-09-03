/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Request, Response } from 'express'
import { CustomError, handleError, PaginationDto } from '../../../domain'
import { CreateAsigGrupoEventoDto } from '../../../domain/DTOs/AssigEventGroup/CreateAsigGroup.dto'
import { UpdateAsigGrupoEventoDto } from '../../../domain/DTOs/AssigEventGroup/UpdateAsigGroup.dto'
import { AsigGrupoEventoService } from '../../services/asigEventGroup.service'

export class AsigGrupoEventoController {
  constructor (private readonly asigGrupoEventoService: AsigGrupoEventoService) {}

  // Obtener todas las asignaciones con paginación
  public getAllAsignaciones = async (req: Request, res: Response): Promise<Response> => {
    const { page = 1, limit = 10 } = req.query

    const [error, paginationDTO] = PaginationDto.create(+page, +limit)
    if (error) return handleError(CustomError.badRequest(error), res)

    try {
      const asignaciones = await this.asigGrupoEventoService.getAllAsignaciones(paginationDTO!)
      return res.status(200).json(asignaciones)
    } catch (error) {
      return handleError(error, res)
    }
  }

  // Obtener una asignación por su ID
  public getAsignacionById = async (req: Request, res: Response): Promise<Response> => {
    const asignacionId = +req.params.id!

    if (isNaN(asignacionId)) {
      return handleError(CustomError.badRequest('The id contains invalid characters'), res)
    }

    try {
      const asignacion = await this.asigGrupoEventoService.getAsignacionById(asignacionId)
      return res.status(200).json(asignacion)
    } catch (error) {
      return handleError(error, res)
    }
  }

  // Crear una nueva asignación
  public createAsignacion = async (req: Request, res: Response): Promise<Response> => {
    const [error, createDto] = CreateAsigGrupoEventoDto.create(req.body)
    if (error) {
      return handleError(CustomError.badRequest(error), res)
    }

    try {
      const nuevaAsignacion = await this.asigGrupoEventoService.createAsignacion(createDto!)
      return res.status(200).json(nuevaAsignacion)
    } catch (error) {
      return handleError(error, res)
    }
  }

  // Actualizar una asignación
  public updateAsignacion = async (req: Request, res: Response): Promise<Response> => {
    const [error, updateDto] = UpdateAsigGrupoEventoDto.update({ ...req.body, id: req.params.id })
    if (error) {
      return handleError(CustomError.badRequest(error), res)
    }

    try {
      const asignacionActualizada = await this.asigGrupoEventoService.updateAsignacion(updateDto!)
      return res.status(200).json(asignacionActualizada)
    } catch (error) {
      return handleError(error, res)
    }
  }

  // Eliminar una asignación
  public deleteAsignacion = async (req: Request, res: Response): Promise<Response> => {
    const asignacionId = +req.params.id!

    if (isNaN(asignacionId)) {
      return handleError(CustomError.badRequest('The id contains invalid characters'), res)
    }

    try {
      const response = await this.asigGrupoEventoService.deleteAsignacion(asignacionId)
      return res.status(200).json(response)
    } catch (error) {
      return handleError(error, res)
    }
  }
}

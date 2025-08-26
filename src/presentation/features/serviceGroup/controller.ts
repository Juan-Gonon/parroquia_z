/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { Request, Response } from 'express'
import { CustomError, handleError, PaginationDto } from '../../../domain'
import { CreateGrupoServicioDto } from '../../../domain/DTOs/serviceGroup/CreateServiceGroup.dto'
import { UpdateGrupoServicioDto } from '../../../domain/DTOs/serviceGroup/UpdateServiceGroup.dto'
import { GrupoServicioService } from '../../services/serviceGroup.service'

// Clase que contiene la lógica del controlador para GrupoServicio
export class GrupoServicioController {
  constructor (private readonly grupoServicioService: GrupoServicioService) {}

  // Obtener todos los grupos de servicio
  public getAllGroups = async (req: Request, res: Response): Promise<Response> => {
    const { page = 1, limit = 10 } = req.query

    const [error, paginationDTO] = PaginationDto.create(+page, +limit)
    if (error) return handleError(CustomError.badRequest(error), res)

    try {
      const groups = await this.grupoServicioService.getAllGroups(paginationDTO!)
      return res.status(200).json(groups)
    } catch (error) {
      return handleError(error, res)
    }
  }

  // Obtener un grupo de servicio por su ID
  public getGroupById = async (req: Request, res: Response): Promise<Response> => {
    const groupId = +req.params.id!

    if (isNaN(groupId)) { return handleError(CustomError.badRequest('The id contains invalid characters'), res) }

    try {
      const group = await this.grupoServicioService.getGroupById(groupId)
      return res.status(200).json(group)
    } catch (error) {
      return handleError(error, res)
    }
  }

  // Crear un nuevo grupo de servicio
  public createGroup = async (req: Request, res: Response): Promise<Response> => {
    const [error, createDto] = CreateGrupoServicioDto.create(req.body)
    if (error) return handleError(CustomError.badRequest(error), res)

    try {
      const group = await this.grupoServicioService.createGroup(createDto!)
      return res.status(200).json(group)
    } catch (error) {
      return handleError(error, res)
    }
  }

  // Actualizar un grupo de servicio
  public updateGroup = async (req: Request, res: Response): Promise<Response> => {
    const [error, updateDto] = UpdateGrupoServicioDto.update({ ...req.body, id: req.params.id })
    if (error) return handleError(CustomError.badRequest(error), res)

    try {
      const group = await this.grupoServicioService.updateGroup(updateDto!)
      return res.status(200).json(group)
    } catch (error) {
      return handleError(error, res)
    }
  }

  // Eliminar un grupo de servicio
  public deleteGroup = async (req: Request, res: Response): Promise<Response> => {
    const groupId = +req.params.id!

    if (isNaN(groupId)) { return handleError(CustomError.badRequest('The id contains invalid characters'), res) }

    try {
      const response = await this.grupoServicioService.deleteGroup(groupId)
      return res.status(200).json(response)
    } catch (error) {
      return handleError(error, res)
    }
  }
}

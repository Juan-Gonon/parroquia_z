/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { Request, Response } from 'express'
import { CustomError, handleError, PaginationDto } from '../../../domain'
import { CreateRolDentroMinisterioDto } from '../../../domain/DTOs/roleMinistery/CreateRoleMinistry.dto'
import { UpdateRolDentroMinisterioDto } from '../../../domain/DTOs/roleMinistery/UpdateRoleMinistry.dto'
import { RolDentroMinisterioService } from '../../services/roleMinistery.service'

export class RolDentroMinisterioController {
  constructor (private readonly rolDentroMinisterioService: RolDentroMinisterioService) {}

  // Obtener todos los roles dentro de un ministerio
  public getAllRoles = async (req: Request, res: Response): Promise<Response> => {
    const { page = 1, limit = 10 } = req.query

    const [error, paginationDTO] = PaginationDto.create(+page, +limit)
    if (error) return handleError(CustomError.badRequest(error), res)

    try {
      const roles = await this.rolDentroMinisterioService.getAllRoles(paginationDTO!)
      return res.status(200).json(roles)
    } catch (error) {
      return handleError(error, res)
    }
  }

  // Obtener un rol dentro de un ministerio por su ID
  public getRolById = async (req: Request, res: Response): Promise<Response> => {
    const rolID = +req.params.id!

    if (isNaN(rolID)) { return handleError(CustomError.badRequest('The id contains invalid characters'), res) }

    try {
      const rol = await this.rolDentroMinisterioService.getRolById(rolID)
      return res.status(200).json(rol)
    } catch (error) {
      return handleError(error, res)
    }
  }

  // Crear un nuevo rol dentro de un ministerio
  public createRol = async (req: Request, res: Response): Promise<Response> => {
    const [error, createDto] = CreateRolDentroMinisterioDto.create(req.body)
    if (error) return handleError(CustomError.badRequest(error), res)

    try {
      const rol = await this.rolDentroMinisterioService.createRol(createDto!)
      return res.status(200).json(rol)
    } catch (error) {
      return handleError(error, res)
    }
  }

  // Actualizar un rol dentro de un ministerio
  public updateRol = async (req: Request, res: Response): Promise<Response> => {
    const [error, updateDto] = UpdateRolDentroMinisterioDto.update({ ...req.body, id: req.params.id })
    if (error) return handleError(CustomError.badRequest(error), res)

    try {
      const rol = await this.rolDentroMinisterioService.updateRol(updateDto!)
      return res.status(200).json(rol)
    } catch (error) {
      return handleError(error, res)
    }
  }

  // Eliminar un rol dentro de un ministerio
  public deleteRol = async (req: Request, res: Response): Promise<Response> => {
    const rolID = +req.params.id!

    if (isNaN(rolID)) { return handleError(CustomError.badRequest('The id contains invalid characters'), res) }

    try {
      const response = await this.rolDentroMinisterioService.deleteRol(rolID)
      return res.status(200).json(response)
    } catch (error) {
      return handleError(error, res)
    }
  }
}

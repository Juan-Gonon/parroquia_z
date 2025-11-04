/* eslint-disable @typescript-eslint/comma-dangle */
/* eslint-disable @typescript-eslint/space-before-function-paren */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Request, Response } from 'express'
import { CustomError, handleError, PaginationDto } from '../../../domain'
import { CreateRolPersonalDto } from '../../../domain/DTOs/RolPersonal/CreateRolPersonal.dto'
import { UpdateRolPersonalDto } from '../../../domain/DTOs/RolPersonal/UpdateRolPersonal.dto'
import { RolPersonalService } from '../../services/RolPersonal.service'

export class RolPersonalController {
  constructor(private readonly rolPersonalService: RolPersonalService) {}

  // Obtener todos los roles de personal
  public getAllRoles = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { page = 1, limit = 10 } = req.query

    const [error, paginationDTO] = PaginationDto.create(+page, +limit)
    if (error) return handleError(CustomError.badRequest(error), res)

    try {
      const roles = await this.rolPersonalService.getAllRoles(paginationDTO!)
      return res.status(200).json(roles)
    } catch (error) {
      return handleError(error, res)
    }
  }

  // Obtener un rol de personal por su ID
  public getRolById = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const rolID = +req.params.id!

    if (isNaN(rolID)) {
      return handleError(
        CustomError.badRequest('The id contains invalid characters'),
        res
      )
    }

    try {
      const rol = await this.rolPersonalService.getRolById(rolID)
      return res.status(200).json(rol)
    } catch (error) {
      return handleError(error, res)
    }
  }

  // Crear un nuevo rol de personal
  public createRol = async (req: Request, res: Response): Promise<Response> => {
    const [error, createDto] = CreateRolPersonalDto.create(req.body)
    if (error) return handleError(CustomError.badRequest(error), res)

    try {
      const rol = await this.rolPersonalService.createRol(createDto!)
      return res.status(200).json(rol)
    } catch (error) {
      return handleError(error, res)
    }
  }

  // Actualizar un rol de personal
  public updateRol = async (req: Request, res: Response): Promise<Response> => {
    const [error, updateDto] = UpdateRolPersonalDto.update({
      ...req.body,
      id: req.params.id,
    })
    if (error) return handleError(CustomError.badRequest(error), res)

    try {
      const rol = await this.rolPersonalService.updateRol(updateDto!)
      return res.status(200).json(rol)
    } catch (error) {
      return handleError(error, res)
    }
  }

  // Eliminar un rol de personal
  public deleteRol = async (req: Request, res: Response): Promise<Response> => {
    const rolID = +req.params.id!

    if (isNaN(rolID)) {
      return handleError(
        CustomError.badRequest('The id contains invalid characters'),
        res
      )
    }

    try {
      const response = await this.rolPersonalService.deleteRol(rolID)
      return res.status(200).json(response)
    } catch (error) {
      return handleError(error, res)
    }
  }
}

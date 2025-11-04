/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { Request, Response } from 'express'
import { CreateMiembroGrupoDto } from '../../../domain/DTOs/groupMember/CreateGroupMember.dto'
import { UpdateMiembroGrupoDto } from '../../../domain/DTOs/groupMember/UpdateGroupMember.dto'
import { CustomError, handleError, PaginationDto } from '../../../domain'
import { MiembroGrupoService } from '../../services/groupMember.service'

export class MiembroGrupoController {
  constructor (private readonly miembroGrupoService: MiembroGrupoService) {}

  // Obtener todos los miembros de grupo
  public getAllMiembros = async (req: Request, res: Response): Promise<Response> => {
    const { page = 1, limit = 10 } = req.query

    const [error, paginationDTO] = PaginationDto.create(+page, +limit)
    if (error) return handleError(CustomError.badRequest(error), res)

    try {
      const miembros = await this.miembroGrupoService.getAllMiembros(paginationDTO!)
      return res.status(200).json(miembros)
    } catch (error) {
      return handleError(error, res)
    }
  }

  // Obtener un miembro de grupo por su ID
  public getMiembroById = async (req: Request, res: Response): Promise<Response> => {
    const miembroId = +req.params.id!

    if (isNaN(miembroId)) {
      return handleError(CustomError.badRequest('The id contains invalid characters'), res)
    }

    try {
      const miembro = await this.miembroGrupoService.getMiembroById(miembroId)
      return res.status(200).json(miembro)
    } catch (error) {
      return handleError(error, res)
    }
  }

  // Crear un nuevo miembro de grupo
  public createMiembro = async (req: Request, res: Response): Promise<Response> => {
    const [error, createDto] = CreateMiembroGrupoDto.create(req.body)
    if (error) {
      return handleError(CustomError.badRequest(error), res)
    }

    try {
      const nuevoMiembro = await this.miembroGrupoService.createMiembro(createDto!)
      return res.status(200).json(nuevoMiembro)
    } catch (error) {
      return handleError(error, res)
    }
  }

  // Actualizar un miembro de grupo
  public updateMiembro = async (req: Request, res: Response): Promise<Response> => {
    const [error, updateDto] = UpdateMiembroGrupoDto.update({ ...req.body, id: req.params.id })
    if (error) {
      return handleError(CustomError.badRequest(error), res)
    }

    try {
      const miembroActualizado = await this.miembroGrupoService.updateMiembro(updateDto!)
      return res.status(200).json(miembroActualizado)
    } catch (error) {
      return handleError(error, res)
    }
  }

  // Eliminar un miembro de grupo
  public deleteMiembro = async (req: Request, res: Response): Promise<Response> => {
    const miembroId = +req.params.id!

    if (isNaN(miembroId)) {
      return handleError(CustomError.badRequest('The id contains invalid characters'), res)
    }

    try {
      const response = await this.miembroGrupoService.deleteMiembro(miembroId)
      return res.status(200).json(response)
    } catch (error) {
      return handleError(error, res)
    }
  }
}

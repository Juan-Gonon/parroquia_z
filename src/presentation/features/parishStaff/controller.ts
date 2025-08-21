/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { Request, Response } from 'express'
import { CustomError, handleError, PaginationDto } from '../../../domain'
import { CreatePersonalParroquialDto } from '../../../domain/DTOs/parishStaff/CreateParishStaff.dto'
import { UpdatePersonalParroquialDto } from '../../../domain/DTOs/parishStaff/UpdateParishStaff.dto'
import { PersonalParroquialService } from '../../services/parishStaff.service'

export class PersonalParroquialController {
  constructor (private readonly personalParroquialService: PersonalParroquialService) {}

  // Obtener todo el personal parroquial
  public getAllPersonal = async (req: Request, res: Response): Promise<Response> => {
    const { page = 1, limit = 10 } = req.query

    const [error, paginationDTO] = PaginationDto.create(+page, +limit)
    if (error) return handleError(CustomError.badRequest(error), res)

    try {
      const personal = await this.personalParroquialService.getAllPersonal(paginationDTO!)
      return res.status(200).json(personal)
    } catch (error) {
      return handleError(error, res)
    }
  }

  // Obtener un registro de personal parroquial por su ID
  public getPersonalById = async (req: Request, res: Response): Promise<Response> => {
    const personalID = +req.params.id!

    if (isNaN(personalID)) { return handleError(CustomError.badRequest('The id contains invalid characters'), res) }

    try {
      const personal = await this.personalParroquialService.getPersonalById(personalID)
      return res.status(200).json(personal)
    } catch (error) {
      return handleError(error, res)
    }
  }

  // Crear un nuevo registro de personal parroquial
  public createPersonal = async (req: Request, res: Response): Promise<Response> => {
    const [error, createDto] = CreatePersonalParroquialDto.create(req.body)
    if (error) return handleError(CustomError.badRequest(error), res)

    try {
      const personal = await this.personalParroquialService.createPersonal(createDto!)
      return res.status(200).json(personal)
    } catch (error) {
      return handleError(error, res)
    }
  }

  // Actualizar un registro de personal parroquial
  public updatePersonal = async (req: Request, res: Response): Promise<Response> => {
    const [error, updateDto] = UpdatePersonalParroquialDto.update({ ...req.body, id: req.params.id })
    if (error) return handleError(CustomError.badRequest(error), res)

    try {
      const personal = await this.personalParroquialService.updatePersonal(updateDto!)
      return res.status(200).json(personal)
    } catch (error) {
      return handleError(error, res)
    }
  }

  // Eliminar un registro de personal parroquial
  public deletePersonal = async (req: Request, res: Response): Promise<Response> => {
    const personalID = +req.params.id!

    if (isNaN(personalID)) { return handleError(CustomError.badRequest('The id contains invalid characters'), res) }

    try {
      const response = await this.personalParroquialService.deletePersonal(personalID)
      return res.status(200).json(response)
    } catch (error) {
      return handleError(error, res)
    }
  }
}

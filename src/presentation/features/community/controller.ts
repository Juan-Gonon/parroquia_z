/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Request, Response } from 'express'
import { CommunityService } from '../../services/Community.service'
import { CustomError, handleError, PaginationDto } from '../../../domain'
import { CreateCommunityDto } from '../../../domain/DTOs/comunitities/CreateCommunityDto'

export class CommunityController {
  constructor (private readonly communityService: CommunityService) {}

  // Obtener todas las comunidades
  public getAllCommunities = async (req: Request, res: Response): Promise<Response> => {
    const { page = 1, limit = 10 } = req.query
    const [error, paginationDTO] = PaginationDto.create(+page, +limit)

    if (error) return handleError(CustomError.badRequest(error), res)

    return await this.communityService.getAllCommunities(paginationDTO!)
      .then((community) => res.status(201).json(community))
      .catch((error) => handleError(error, res))
  }

  public getCommunityById = async (req: Request, res: Response): Promise<Response> => {
    const communityID = +req.params.id!

    if (isNaN(communityID)) return handleError(CustomError.badRequest('The id contains invalid characters'), res)

    return await this.communityService.getCommunityById(communityID)
      .then((community) => res.status(201).json(community))
      .catch((error) => handleError(error, res))
  }

  // Crear una nueva comunidad
  public createCommunity = async (req: Request, res: Response): Promise<Response> => {
    const [error, createDto] = CreateCommunityDto.create(req.body)

    if (error) return handleError(CustomError.badRequest(error), res)

    return await this.communityService.createCommunity(createDto!)
      .then((community) => res.status(201).json(community))
      .catch((error) => handleError(error, res))
  }

  // Actualizar una comunidad
  public async updateCommunity (id: number): Promise<void> {
    // Lógica para actualizar una comunidad
  }

  // Eliminar una comunidad
  public async deleteCommunity (id: number): Promise<void> {
    // Lógica para eliminar una comunidad
  }
}

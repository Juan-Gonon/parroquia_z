/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Request, Response } from 'express'
import { CommunityService } from '../../services/Community.service'
import { handleError, PaginationDto } from '../../../domain'
import { CreateCommunityDto } from '../../../domain/DTOs/comunitities/CreateCommunityDto'

export class CommunityController {
  constructor (private readonly communityService: CommunityService) {}

  // Obtener todas las comunidades
  public getAllCommunities = async (req: Request, res: Response): Promise<Response> => {
    const { page = 1, limit = 10 } = req.query
    const [error, paginationDTO] = PaginationDto.create(+page, +limit)

    if (error) return res.status(400).json({ error })

    return await this.communityService.getAllCommunities(paginationDTO!)
      .then((community) => res.status(201).json(community))
      .catch((error) => handleError(error, res))
  }

  // Obtener una comunidad por su ID
  //   public async getCommunityById (id: number): Promise<void> {
  //     // Lógica para obtener una comunidad por su ID
  //   }

  // Crear una nueva comunidad
  createCommunity = async (req: Request, res: Response): Promise<void> => {
    const [error, createDto] = CreateCommunityDto.create(req.body)

    console.log({
      error,
      createDto
    })
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

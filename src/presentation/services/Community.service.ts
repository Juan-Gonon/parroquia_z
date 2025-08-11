/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { prisma } from '../../data/postgress'
import { CustomError, PaginationDto } from '../../domain'
import { PaginatedCommunityResponseDTO } from '../../types/comunitities'

export class CommunityService {
  public async getAllCommunities (paginationDTO: PaginationDto): Promise<PaginatedCommunityResponseDTO> {
    const { page, limit } = paginationDTO

    const offset = (page - 1) * limit

    try {
      const [total, comunities] = await prisma.$transaction([
        prisma.comunidad.count(),
        prisma.comunidad.findMany({
          skip: offset,
          take: limit,
          include: {
            parroquia: {
              select: {
                nombre: true
              }
            }
          }
        })
      ])

      if (!comunities || comunities.length === 0) throw CustomError.badRequest('Communities are empty')

      return {
        page,
        limit,
        total,
        next: `/api/communities?page=${page + 1}&limit=${limit}`,
        prev: page > 1 ? `/api/communities?page=${page - 1}&limit=${limit}` : null,
        comunities
      }
    } catch (error) {
      if (error instanceof CustomError) {
        throw error
      }

      throw CustomError.internalServer('Internal server error')
    }
  }
}

/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { prisma } from '../../data/postgress'
import { CustomError, PaginationDto, CreateCommunityDTO } from '../../domain'
import { CommunityResponseDTO, PaginatedCommunityResponseDTO } from '../../types/comunitities'

export class CommunityService {
  public async getCommunityByName (name: string): Promise<CommunityResponseDTO | null> {
    try {
      const community = await prisma.comunidad.findFirst({
        where: {
          nombre: name
        }
      })

      return community as CommunityResponseDTO
    } catch (error) {
      if (error instanceof CustomError) {
        throw error
      }

      return null
    }
  }

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

  public async createCommunity (createCommunityDTO: CreateCommunityDTO): Promise<CommunityResponseDTO | null> {
    try {
      const communityExist = await this.getCommunityByName(createCommunityDTO.nombre)

      if (communityExist) throw CustomError.badRequest('Community exist')

      const { nombre, direccion, email, telefono, id_parroquia: idParroquia } = createCommunityDTO

      const community = await prisma.comunidad.create({
        data: {
          nombre,
          direccion,
          telefono: telefono ?? null,
          email: email ?? null,
          id_parroquia: idParroquia
        }
      })

      return community as CommunityResponseDTO
    } catch (error) {
      if (error instanceof CustomError) {
        throw error
      }

      throw CustomError.internalServer('Error internal server')
    }
  }
}

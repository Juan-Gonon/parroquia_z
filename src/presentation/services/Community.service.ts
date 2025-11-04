/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { prisma } from '../../data/postgress'
import { CustomError, PaginationDto, CreateCommunityDTO, UpdateCommunityDto } from '../../domain'
import { CommunityResponseDTO, PaginatedCommunityResponseDTO } from '../../types/comunitities'

export class CommunityService {
  public async getCommunityByName (name: string): Promise<CommunityResponseDTO | null> {
    try {
      const community = await prisma.comunidad.findFirst({
        where: {
          nombre: name
        }
      })

      return community
    } catch (error) {
      if (error instanceof CustomError) {
        throw error
      }

      return null
    }
  }

  public async getCommunityById (id: number): Promise <CommunityResponseDTO> {
    try {
      const community = await prisma.comunidad.findFirst({
        where: {
          id_comunidad: id
        }
      })

      if (!community) throw CustomError.badRequest('The specified community does not exist')

      return community
    } catch (error) {
      if (error instanceof CustomError) throw error

      throw CustomError.internalServer('Internal server error')
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

      if (!comunities || comunities.length === 0) throw CustomError.badRequest('The communities are empty')

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

      if (communityExist) throw CustomError.badRequest('The community already exists')

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

  public async updateCommunity (updateCommunityDto: UpdateCommunityDto): Promise<CommunityResponseDTO> {
    const communityById = await this.getCommunityById(updateCommunityDto.id)
    try {
      // updateCommunityDto.nombre ?? communityById.nombre
      // updateCommunityDto.direccion ?? communityById.direccion

      if (!communityById) throw CustomError.badRequest('Community not found')

      const uCommunity = await prisma.comunidad.update({
        data: updateCommunityDto.values,
        where: {
          id_comunidad: communityById.id_comunidad
        }
      })

      return uCommunity
    } catch (error) {
      if (error instanceof CustomError) throw error

      throw CustomError.internalServer('Internal server error')
    }
  }

  public async deleteCommunity (id: number): Promise<{ success: boolean, message: string }> {
    const communityExist = await this.getCommunityById(id)
    try {
      if (!communityExist) throw CustomError.badRequest('Community not found')

      await prisma.comunidad.delete({
        where: {
          id_comunidad: id
        }
      })

      return {
        success: true,
        message: 'Community deleted successfully'
      }
    } catch (error) {
      if (error instanceof CustomError) throw error

      throw CustomError.internalServer('Internal server error')
    }
  }
}

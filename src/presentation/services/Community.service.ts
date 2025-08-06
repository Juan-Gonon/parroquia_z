import { prisma } from '../../data/postgress'

export class CommunityService {
  public async getAllCommunities (): Promise<void> {
    try {
      const community = await prisma.comunidad.findMany({
        include: {
          parroquia: {
            select: {
              nombre: true
            }
          }
        }
      })

      community?.forEach((com) => console.log(com))
    } catch (error) {
      throw new Error('Error gets user not found')
    }
  }
}

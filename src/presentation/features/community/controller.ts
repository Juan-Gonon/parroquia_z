import { CommunityService } from '../../services/Community.service'

export class CommunityController {
  constructor (private readonly communityService: CommunityService) {}

  // Obtener todas las comunidades
  public getAllCommunities = async (): Promise<void> => {
    await this.communityService.getAllCommunities()
  }

  // Obtener una comunidad por su ID
  //   public async getCommunityById (id: number): Promise<void> {
  //     // Lógica para obtener una comunidad por su ID
  //   }

  // Crear una nueva comunidad
  public async createCommunity (): Promise<void> {
    // Lógica para crear una comunidad
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

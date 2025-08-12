
export interface BaseCommunity {
  id_comunidad: number
  nombre: string
  direccion: string
  id_parroquia: number
}

export interface CommunityResponseDTO extends BaseCommunity {
  telefono: string | null
  email: string | null
}

export interface CommunityWithParishName extends BaseCommunity {
  telefono: string | null
  email: string | null
  parroquia: {
    nombre: string
  }
}

export interface PaginatedCommunityResponseDTO {
  page: number
  limit: number
  total: number
  next: string | null
  prev: string | null
  comunities: CommunityWithParishName[]
}

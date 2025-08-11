
export interface CommunityWithParishName {
  id_comunidad: number
  nombre: string
  direccion: string
  telefono: string | null
  email: string | null
  id_parroquia: number
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

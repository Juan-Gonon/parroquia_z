/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unused-expressions */

import { regularExps } from '../../../config'

/* eslint-disable @typescript-eslint/naming-convention */
export interface CreateCommunityDTO {
  nombre: string
  direccion: string
  telefono?: string | null
  email?: string | null
  id_parroquia: number
}

export class CreateCommunityDto implements CreateCommunityDTO {
  nombre: string
  direccion: string
  telefono?: string | null
  email?: string | null
  id_parroquia: number

  constructor ({ nombre, direccion, telefono, email, id_parroquia }: CreateCommunityDTO) {
    this.nombre = nombre
    this.direccion = direccion
    this.telefono = telefono ?? null
    this.email = email ?? null
    this.id_parroquia = id_parroquia
  }

  static create ({ nombre, direccion, telefono, email, id_parroquia }: CreateCommunityDTO): [ string?, CreateCommunityDto?] {
    if (!nombre) return ['The name is required']
    if (!direccion) return ['The address is required']
    if (id_parroquia === null || id_parroquia === undefined) {
      return ['The parish ID must be a valid number']
    }

    if (telefono && !regularExps.phone.test(telefono)) {
      return ['The phone number must have exactly 8 digits']
    }

    if (email && !regularExps.email.test(email)) {
      return ['The email addres is not  vailid']
    }

    return [undefined!, new CreateCommunityDto({ nombre, direccion, telefono: telefono ?? null, email: email ?? null, id_parroquia })]
  }
}

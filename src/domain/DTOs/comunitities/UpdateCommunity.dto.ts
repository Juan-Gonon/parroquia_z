/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-extraneous-class */

import { regularExps } from '../../../config'

interface UpdateCommunity {
  id: number
  nombre: string
  direccion: string
  telefono: string
  email: string
}
export class UpdateCommunityDto implements UpdateCommunity {
  id: number
  nombre: string
  direccion: string
  telefono: string
  email: string

  constructor ({ id, nombre, direccion, email, telefono }: UpdateCommunity) {
    this.id = id
    this.nombre = nombre
    this.direccion = direccion
    this.telefono = telefono
    this.email = email
  }

  get values (): object {
    const communityObj: { [key: string]: any } = {}

    // if (this.id) communityObj.id = this.id
    if (this.nombre) communityObj.nombre = this.nombre
    if (this.direccion) communityObj.direccion = this.direccion
    if (this.telefono) communityObj.telefono = this.telefono
    if (this.email) communityObj.email = this.email

    return communityObj
  }

  static update ({ id, nombre, direccion, telefono, email }: UpdateCommunity): [string?, UpdateCommunityDto?] {
    const idComunidad = +id

    if (isNaN(idComunidad)) return ['The id contains invalid characters']
    if (telefono && !regularExps.phone.test(telefono)) return ['The phone number is not valid']
    if (email && !regularExps.email.test(email)) return ['The email address is not valid ']

    return [undefined!, new UpdateCommunityDto({ id: idComunidad, nombre, email, direccion, telefono })]
  }
}

/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { RawUserFromDB } from '../../types/user'
import { CustomError } from '../errors/custom.error'

interface UserEntityP {
  idUsuario: number
  usuarioacceso: string
  contrasena: string
}

export class UserEntity implements UserEntityP {
  idUsuario: number
  usuarioacceso: string
  contrasena: string

  constructor ({ idUsuario, usuarioacceso, contrasena }: UserEntityP) {
    this.idUsuario = idUsuario
    this.usuarioacceso = usuarioacceso
    this.contrasena = contrasena
  }

  static fromObject (Object: RawUserFromDB): UserEntity {
    const { id_usuario: idUsuario, usuarioacceso, contrasena } = Object

    // console.log(idUsuario)

    if (!idUsuario) {
      throw CustomError.badRequest('Missing id')
    }

    if (!usuarioacceso) throw CustomError.badRequest('Missing user')
    if (!contrasena) throw CustomError.badRequest('Missing password')

    return new UserEntity({ idUsuario, usuarioacceso, contrasena })
  }
}

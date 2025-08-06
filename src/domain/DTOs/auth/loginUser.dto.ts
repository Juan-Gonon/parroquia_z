/* eslint-disable @typescript-eslint/no-non-null-assertion */
// import { regularExps } from '../../../config'

interface LoginUser {
  usuario: string
  password: string
}

export class LoginUserDTO {
  private constructor (public readonly user: string, public readonly password: string) {}

  static login (user: LoginUser): [string?, LoginUserDTO?] {
    const { usuario, password } = user

    if (usuario.length <= 0) return ['Missing user']
    // if (!regularExps.email.test(email)) return ['Email is not valid']
    if (password.length <= 0) return ['Missing password']
    if (password.length <= 0) return ['Password to short']

    return [undefined!, new LoginUserDTO(usuario, password)]
  }
}

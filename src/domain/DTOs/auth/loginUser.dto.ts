import { regularExps } from '../../../config'

interface LoginUser {
  email: string
  password: string
}

export class LoginUserDTO {
  private constructor (public readonly email: string, public readonly password: string) {}

  static login (user: LoginUser): [string?, LoginUserDTO?] {
    const { email, password } = user

    if (email.length <= 0) return ['Missing email']
    if (!regularExps.email.test(email)) return ['Email is not valid']
    if (password.length <= 0) return ['Missing password']
    if (password.length <= 0) return ['Password to short']

    return ['', new LoginUserDTO(email, password)]
  }
}

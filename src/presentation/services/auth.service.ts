/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { prisma } from '../../data/postgress'
import { LoginUserDTO, UserEntity } from '../../domain'
// import { CustomError } from '../../domain'

export class AuthService {
  public async findOneUser (user: string): Promise<UserEntity | null> {
    const userExist = await prisma.usuario.findUnique({
      where: {
        usuarioacceso: user
      }
    })

    return userExist !== null ? UserEntity.fromObject(userExist) : null
  }

  public async loginUser (loginUserDTO: LoginUserDTO): Promise<UserEntity | null> {
    const user = await this.findOneUser(loginUserDTO.user)

    return user
  }
}

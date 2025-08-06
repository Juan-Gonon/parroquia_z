/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { bcryptAdapter } from '../../config'
import { prisma } from '../../data/postgress'
import { CustomError, LoginUserDTO, UserEntity } from '../../domain'
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
    try {
      const user = await this.findOneUser(loginUserDTO.user)

      if (!user) throw CustomError.badRequest('User does not exist')

      const isMatching = bcryptAdapter.compare(
        loginUserDTO.password,
        user.contrasena
      )

      if (!isMatching) throw CustomError.badRequest('Invalid user')

      return user
    } catch (error) {
      if (error instanceof Error) {
        throw CustomError.internalServer(error.message)
      }

      throw CustomError.internalServer('Unknown error')
    }
  }
}

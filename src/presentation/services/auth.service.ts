/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { bcryptAdapter, JwtAdapter } from '../../config'
import { prisma } from '../../data/postgress'
import { CustomError, LoginUserDTO, UserEntity } from '../../domain'
import { UserServiceR } from '../../types/user'

export class AuthService {
  public async findOneUser (user: string): Promise<UserEntity | null> {
    const userExist = await prisma.usuario.findUnique({
      where: {
        usuarioacceso: user
      }
    })

    return userExist !== null ? UserEntity.fromObject(userExist) : null
  }

  public async loginUser (loginUserDTO: LoginUserDTO): Promise<UserServiceR | null> {
    try {
      const user = await this.findOneUser(loginUserDTO.user)

      if (!user) throw CustomError.badRequest('User does not exist')

      const isMatching = bcryptAdapter.compare(
        loginUserDTO.password,
        user.contrasena
      )

      if (!isMatching) throw CustomError.badRequest('Invalid user')

      const { contrasena, ...userEntity } = user
      const token = await JwtAdapter.generateToken({ ...userEntity })

      if (!token) throw CustomError.internalServer('Error while creating JWT')

      return {
        ...userEntity,
        token
      }
    } catch (error) {
      if (error instanceof Error) {
        throw CustomError.internalServer(error.message)
      }

      throw CustomError.internalServer('Unknown error')
    }
  }
}

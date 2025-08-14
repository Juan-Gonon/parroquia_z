/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { NextFunction, Response } from 'express'
import { CustomError, handleError } from '../../domain'
import { JwtAdapter } from '../../config'
import { prisma } from '../../data/postgress'
import { AuthenticatedRequest, payloadJWT } from '../../types/user'

/* eslint-disable @typescript-eslint/no-extraneous-class */
export class ValidateJWT {
  static async validate (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | any> {
    //  console.log(req.headers.authorization)
    const authorization = req.headers.authorization

    if (!authorization) {
      throw CustomError.unAuthorized('No token provider')
    }

    if (!authorization.startsWith('Bearer ')) {
      throw CustomError.unAuthorized('Invalid barer token')
    }

    const token = authorization.split(' ').at(1) ?? ''

    try {
      const payload = await JwtAdapter.validateToken<payloadJWT>(token)

      if (!payload) throw CustomError.unAuthorized('Invalid token')

      const userFromDb = await prisma.usuario.findFirst({
        where: {
          id_usuario: payload.idUsuario
        }
      })

      if (!userFromDb) throw CustomError.unAuthorized('Invalid token user')

      const { id_usuario: idUsuario, usuarioacceso } = userFromDb
      req.user = {
        idUsuario,
        usuarioacceso
      }
      return next()
    } catch (error) {
      return handleError(error, res)
    }
  }
}

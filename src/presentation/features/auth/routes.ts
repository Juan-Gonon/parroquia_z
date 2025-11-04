/* eslint-disable @typescript-eslint/no-extraneous-class */
import { Router } from 'express'
import { AuhtController } from './controller'
import { AuthService } from '../../services/auth.service'
import { ValidateJWT } from '../../middleware/validateJWT'

export class AuthRoutes {
  static get routes (): Router {
    const router = Router()
    const authService = new AuthService()
    const controller = new AuhtController(authService)

    router.post('/login', controller.loginUser)
    router.get('/renew', [ValidateJWT.validate], controller.revalidateToken)

    return router
  }
}

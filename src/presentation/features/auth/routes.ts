/* eslint-disable @typescript-eslint/no-extraneous-class */
import { Router } from 'express'
import { AuhtController } from './controller'

export class AuthRoutes {
  static get routes (): Router {
    const router = Router()
    const controller = new AuhtController()

    router.post('/login', controller.loginUser)

    return router
  }
}

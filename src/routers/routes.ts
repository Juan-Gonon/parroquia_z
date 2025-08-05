/* eslint-disable @typescript-eslint/no-extraneous-class */
import { Router } from 'express'

export class AppRouter {
  static get router (): Router {
    const router = Router()

    router.use('/api/auth')

    return router
  }
}

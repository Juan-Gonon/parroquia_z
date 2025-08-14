/* eslint-disable @typescript-eslint/no-extraneous-class */
import { Router } from 'express'
import { AuthRoutes } from '../presentation/features/auth/routes'
import { CommunityRoutes } from '../presentation/features/community/routes'
import { TipoTurnoRoutes } from '../presentation/features/shiftType/routes'

export class AppRouter {
  static get routes (): Router {
    const router = Router()

    router.use('/api/auth', AuthRoutes.routes)
    router.use('/api/communities', CommunityRoutes.router)
    router.use('/api/tipos-turno', TipoTurnoRoutes.router)

    return router
  }
}

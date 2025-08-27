/* eslint-disable @typescript-eslint/no-extraneous-class */
import { Router } from 'express'
import { AuthRoutes } from '../presentation/features/auth/routes'
import { CommunityRoutes } from '../presentation/features/community/routes'
import { TipoTurnoRoutes } from '../presentation/features/shiftType/routes'
import { EventTypeRoutes } from '../presentation/features/eventType/routes'
import { TipoIntencionRoutes } from '../presentation/features/intentionalType/routes'
import { MinisterioRoutes } from '../presentation/features/ministry/routes'
import { RolPersonalRoutes } from '../presentation/features/rolePersonal/routes'
import { RolDentroMinisterioRoutes } from '../presentation/features/roleMinistry/route'
import { PersonalParroquialRoutes } from '../presentation/features/parishStaff/routes'
import { GrupoServicioRoutes } from '../presentation/features/serviceGroup/routes'
import { EventoRoutes } from '../presentation/features/event/route'

export class AppRouter {
  static get routes (): Router {
    const router = Router()

    router.use('/api/auth', AuthRoutes.routes)
    router.use('/api/communities', CommunityRoutes.router)
    router.use('/api/tipos-turno', TipoTurnoRoutes.router)
    router.use('/api/event-type', EventTypeRoutes.router)
    router.use('/api/intentional-type', TipoIntencionRoutes.router)
    router.use('/api/ministry', MinisterioRoutes.router)
    router.use('/api/personal-role', RolPersonalRoutes.router)
    router.use('/api/role-d-ministry', RolDentroMinisterioRoutes.router)
    router.use('/api/parish-staff', PersonalParroquialRoutes.router)
    router.use('/api/service-group', GrupoServicioRoutes.router)
    router.use('/api/event', EventoRoutes.router)

    return router
  }
}

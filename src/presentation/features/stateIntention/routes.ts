/* eslint-disable @typescript-eslint/space-before-function-paren */
/* eslint-disable @typescript-eslint/no-extraneous-class */
import { Router } from 'express'
import { ValidateJWT } from '../../middleware/validateJWT'
import { StateIntentionService } from '../../services/stateIntention.service'
import { SatateIntentionController } from './controller'

export class StateIntentionRoutes {
  static get router(): Router {
    const router = Router()
    const stateIntentionService = new StateIntentionService()
    const controller = new SatateIntentionController(stateIntentionService)

    router.use(ValidateJWT.validate)

    router.get('/', controller.getAllStateIntention)

    return router
  }
}

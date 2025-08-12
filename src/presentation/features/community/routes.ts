/* eslint-disable @typescript-eslint/no-extraneous-class */
import { Router } from 'express'
import { CommunityController } from './controller'
import { CommunityService } from '../../services/Community.service'

export class CommunityRoutes {
  static get router (): Router {
    const router = Router()
    const communityService = new CommunityService()
    const controller = new CommunityController(communityService)

    router.get('/', controller.getAllCommunities)
    router.get('/:id', controller.getCommunityById)
    router.post('/', controller.createCommunity)

    return router
  }
}

/* eslint-disable @typescript-eslint/no-extraneous-class */
import { Router } from 'express'
import { CommunityController } from './controller'
import { CommunityService } from '../../services/Community.service'
import { param } from 'express-validator'
import { PARAMS_BODY } from '../../../constants/params.c'
import { validationMessages } from '../../../constants/validationMessage.c'
import { ValidateFields } from '../../middleware/ValidateFields'

export class CommunityRoutes {
  static get router (): Router {
    const router = Router()
    const communityService = new CommunityService()
    const controller = new CommunityController(communityService)

    router.get('/', controller.getAllCommunities)
    router.get('/:id', [param(PARAMS_BODY.id).isInt().withMessage(validationMessages.notInteger('Id_comunidad')), ValidateFields.validate], controller.getCommunityById)
    router.post('/', controller.createCommunity)
    router.put('/:id', controller.updateCommunity)
    router.delete('/:id', controller.deleteCommunity)

    return router
  }
}

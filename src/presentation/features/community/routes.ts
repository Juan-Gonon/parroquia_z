/* eslint-disable @typescript-eslint/comma-dangle */
/* eslint-disable @typescript-eslint/space-before-function-paren */
/* eslint-disable @typescript-eslint/no-extraneous-class */
import { Router } from 'express'
import { CommunityController } from './controller'
import { CommunityService } from '../../services/Community.service'
import { param, body } from 'express-validator'
import { PARAMS_BODY } from '../../../constants/params.c'
import { validationMessages } from '../../../constants/validationMessage.c'
import { ValidateFields } from '../../middleware/ValidateFields'
import { ValidateJWT } from '../../middleware/validateJWT'

export class CommunityRoutes {
  static get router(): Router {
    const router = Router()
    const communityService = new CommunityService()
    const controller = new CommunityController(communityService)

    router.use(ValidateJWT.validate)

    router.get('/', controller.getAllCommunities)
    router.get(
      '/:id',
      [
        param(PARAMS_BODY.id)
          .isInt()
          .withMessage(validationMessages.notInteger('Id_comunidad')),
        ValidateFields.validate,
      ],
      controller.getCommunityById
    )
    router.post(
      '/',
      [
        body(PARAMS_BODY.nombre)
          .notEmpty()
          .withMessage(validationMessages.required(PARAMS_BODY.nombre)),

        body(PARAMS_BODY.direccion)
          .notEmpty()
          .withMessage(validationMessages.required(PARAMS_BODY.direccion)),

        body('id_parroquia')
          .notEmpty()
          .withMessage(validationMessages.required('id_parroquia'))
          .isInt()
          .withMessage(validationMessages.notInteger('id_parroquia')),

        body(PARAMS_BODY.telefono)
          .optional()
          .matches(/^\d{8}$/)
          .withMessage('The phone number must have exactly 8 digits'),

        body(PARAMS_BODY.email)
          .optional()
          .isEmail()
          .withMessage(validationMessages.invalidEmail(PARAMS_BODY.email)),

        ValidateFields.validate,
      ],
      controller.createCommunity
    )
    router.put(
      '/:id',
      [
        param(PARAMS_BODY.id)
          .isInt()
          .withMessage(validationMessages.notInteger(PARAMS_BODY.id)),

        body(PARAMS_BODY.nombre)
          .optional()
          .notEmpty()
          .withMessage(validationMessages.required(PARAMS_BODY.nombre)),

        body(PARAMS_BODY.direccion)
          .optional()
          .notEmpty()
          .withMessage(validationMessages.required(PARAMS_BODY.direccion)),

        body('id_parroquia')
          .optional()
          .isInt()
          .withMessage(validationMessages.notInteger('id_parroquia')),

        body(PARAMS_BODY.telefono)
          .optional()
          .matches(/^\d{8}$/)
          .withMessage('The phone number must have exactly 8 digits'),

        body(PARAMS_BODY.email)
          .optional()
          .isEmail()
          .withMessage(validationMessages.invalidEmail(PARAMS_BODY.email)),

        ValidateFields.validate,
      ],
      controller.updateCommunity
    )
    router.delete(
      '/:id',
      [
        param(PARAMS_BODY.id)
          .isInt()
          .withMessage(validationMessages.notInteger('Id_comunidad')),
        ValidateFields.validate,
      ],
      controller.deleteCommunity
    )

    return router
  }
}

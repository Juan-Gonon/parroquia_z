/* eslint-disable @typescript-eslint/no-extraneous-class */
import { Router } from 'express'
import { param, body } from 'express-validator'
import { PARAMS_BODY } from '../../../constants/params.c'
import { ValidateFields } from '../../middleware/ValidateFields'
import { validationMessages } from '../../../constants/validationMessage.c'
import { FeligresService } from '../../services/feligres.service'
import { FeligresController } from './controller'

export class FeligresRoutes {
  static get router (): Router {
    const router = Router()
    const service = new FeligresService()
    const controller = new FeligresController(service)

    router.get('/', controller.getAll)

    router.get('/:id', [
      param(PARAMS_BODY.id)
        .isInt().withMessage(validationMessages.notInteger(PARAMS_BODY.id)),
      ValidateFields.validate
    ], controller.getById)

    router.post(
      '/',
      [
        body(PARAMS_BODY.nombre)
          .notEmpty().withMessage(validationMessages.required(PARAMS_BODY.nombre))
          .isString().withMessage(validationMessages.notString(PARAMS_BODY.nombre))
          .isLength({ max: 100 }).withMessage(validationMessages.tooLong(PARAMS_BODY.nombre, 100)),
        body(PARAMS_BODY.apellido)
          .notEmpty().withMessage(validationMessages.required(PARAMS_BODY.apellido))
          .isString().withMessage(validationMessages.notString(PARAMS_BODY.apellido))
          .isLength({ max: 100 }).withMessage(validationMessages.tooLong(PARAMS_BODY.apellido, 100)),
        body(PARAMS_BODY.telefono)
          .optional({ checkFalsy: true })
          .isString().withMessage(validationMessages.notString(PARAMS_BODY.telefono))
          .isLength({ max: 8, min: 8 }).withMessage(validationMessages.tooLong(PARAMS_BODY.telefono, 8)),
        body(PARAMS_BODY.email)
          .optional({ checkFalsy: true })
          .isEmail().withMessage(validationMessages.invalidEmail(PARAMS_BODY.email))
          .isLength({ max: 255 }).withMessage(validationMessages.tooLong(PARAMS_BODY.email, 255)),
        ValidateFields.validate
      ],
      controller.create
    )

    router.put(
      '/:id',
      [
        param(PARAMS_BODY.id)
          .isInt().withMessage(validationMessages.notInteger(PARAMS_BODY.id)),
        body(PARAMS_BODY.nombre)
          .optional()
          .isString().withMessage(validationMessages.notString(PARAMS_BODY.nombre))
          .isLength({ max: 100 }).withMessage(validationMessages.tooLong(PARAMS_BODY.nombre, 100)),
        body(PARAMS_BODY.apellido)
          .optional()
          .isString().withMessage(validationMessages.notString(PARAMS_BODY.apellido))
          .isLength({ max: 100 }).withMessage(validationMessages.tooLong(PARAMS_BODY.apellido, 100)),
        body(PARAMS_BODY.telefono)
          .optional()
          .isString().withMessage(validationMessages.notString(PARAMS_BODY.telefono))
          .isLength({ max: 8, min: 8 }).withMessage(validationMessages.tooLong(PARAMS_BODY.telefono, 8)),
        body(PARAMS_BODY.email)
          .optional()
          .isEmail().withMessage(validationMessages.invalidEmail(PARAMS_BODY.email))
          .isLength({ max: 255 }).withMessage(validationMessages.tooLong(PARAMS_BODY.email, 255)),
        ValidateFields.validate
      ],
      controller.update
    )

    router.delete('/:id', [
      param(PARAMS_BODY.id)
        .isInt().withMessage(validationMessages.notInteger(PARAMS_BODY.id)),
      ValidateFields.validate
    ], controller.delete)

    return router
  }
}

/* eslint-disable @typescript-eslint/no-extraneous-class */
import { Router } from 'express'
import { param, body } from 'express-validator'
import { PARAMS_BODY } from '../../../constants/params.c'
import { validationMessages } from '../../../constants/validationMessage.c'
import { ValidateFields } from '../../middleware/ValidateFields'
import { MinisterioController } from './controller'
import { MinisterioService } from '../../services/ministry.service'

export class MinisterioRoutes {
  static get router (): Router {
    const router = Router()
    const ministerioService = new MinisterioService()
    const controller = new MinisterioController(ministerioService)

    // Ruta para obtener todos los ministerios
    router.get('/', controller.getAllMinisterios)

    // Ruta para obtener un ministerio por su ID
    router.get(
      '/:id',
      [
        param(PARAMS_BODY.id)
          .isInt()
          .withMessage(validationMessages.notInteger('id_ministerio')),
        ValidateFields.validate
      ],
      controller.getMinisterioById
    )

    // Ruta para crear un nuevo ministerio
    router.post(
      '/',
      [
        body(PARAMS_BODY.nombre)
          .notEmpty()
          .withMessage(validationMessages.required(PARAMS_BODY.nombre)),
        body(PARAMS_BODY.descripcion).optional(),
        body(PARAMS_BODY.fechafundacion)
          .optional()
          .isISO8601()
          .withMessage(validationMessages.notDate(PARAMS_BODY.fechafundacion)),
        ValidateFields.validate
      ],
      controller.createMinisterio
    )

    // Ruta para actualizar un ministerio
    router.put(
      '/:id',
      [
        param(PARAMS_BODY.id)
          .isInt()
          .withMessage(validationMessages.notInteger('id_ministerio')),
        body(PARAMS_BODY.nombre)
          .optional()
          .notEmpty()
          .withMessage(validationMessages.required(PARAMS_BODY.nombre)),
        body(PARAMS_BODY.descripcion).optional(),
        body(PARAMS_BODY.fechafundacion)
          .optional()
          .isISO8601()
          .withMessage(validationMessages.notDate(PARAMS_BODY.fechafundacion)),
        ValidateFields.validate
      ],
      controller.updateMinisterio
    )

    // Ruta para eliminar un ministerio por su ID
    router.delete(
      '/:id',
      [
        param(PARAMS_BODY.id)
          .isInt()
          .withMessage(validationMessages.notInteger('id_ministerio')),
        ValidateFields.validate
      ],
      controller.deleteMinisterio
    )

    return router
  }
}

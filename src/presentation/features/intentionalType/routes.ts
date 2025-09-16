/* eslint-disable @typescript-eslint/comma-dangle */
/* eslint-disable @typescript-eslint/space-before-function-paren */
/* eslint-disable @typescript-eslint/no-extraneous-class */
import { Router } from 'express'
import { param, body } from 'express-validator'
import { PARAMS_BODY } from '../../../constants/params.c'
import { validationMessages } from '../../../constants/validationMessage.c'
import { ValidateFields } from '../../middleware/ValidateFields'
import { TipoIntencionController } from './controller'
import { TipoIntencionService } from '../../services/intentionalType.service'
import { ValidateJWT } from '../../middleware/validateJWT'

export class TipoIntencionRoutes {
  static get router(): Router {
    const router = Router()
    const tipoIntencionService = new TipoIntencionService()
    const controller = new TipoIntencionController(tipoIntencionService)

    router.use(ValidateJWT.validate)

    // Ruta para obtener todos los tipos de intención
    router.get('/', controller.getAllTipoIntenciones)

    // Ruta para obtener un tipo de intención por su ID
    router.get(
      '/:id',
      [
        param(PARAMS_BODY.id)
          .isInt()
          .withMessage(validationMessages.notInteger('id_tipoIntencion')),
        ValidateFields.validate,
      ],
      controller.getTipoIntencionById
    )

    // Ruta para crear un nuevo tipo de intención
    router.post(
      '/',
      [
        body(PARAMS_BODY.nombre)
          .notEmpty()
          .withMessage(validationMessages.required(PARAMS_BODY.nombre)),
        body(PARAMS_BODY.descripcion).optional().notEmpty(),
        ValidateFields.validate,
      ],
      controller.createTipoIntencion
    )

    // Ruta para actualizar un tipo de intención
    router.put(
      '/:id',
      [
        param(PARAMS_BODY.id)
          .isInt()
          .withMessage(validationMessages.notInteger('id_tipoIntencion')),
        body(PARAMS_BODY.nombre)
          .optional()
          .notEmpty()
          .withMessage(validationMessages.required(PARAMS_BODY.nombre)),
        body(PARAMS_BODY.descripcion).optional().notEmpty(),
        ValidateFields.validate,
      ],
      controller.updateTipoIntencion
    )

    // Ruta para eliminar un tipo de intención por su ID
    router.delete(
      '/:id',
      [
        param(PARAMS_BODY.id)
          .isInt()
          .withMessage(validationMessages.notInteger('id_tipoIntencion')),
        ValidateFields.validate,
      ],
      controller.deleteTipoIntencion
    )

    return router
  }
}

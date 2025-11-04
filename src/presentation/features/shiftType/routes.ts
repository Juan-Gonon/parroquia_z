/* eslint-disable @typescript-eslint/comma-dangle */
/* eslint-disable @typescript-eslint/space-before-function-paren */
/* eslint-disable @typescript-eslint/no-extraneous-class */
import { Router } from 'express'
import { param, body } from 'express-validator'
import { PARAMS_BODY } from '../../../constants/params.c'
import { validationMessages } from '../../../constants/validationMessage.c'
import { ValidateFields } from '../../middleware/ValidateFields'
import { TipoTurnoController } from './controller'
import { TipoTurnoService } from '../../services/tipoTurno.service'
import { ValidateJWT } from '../../middleware/validateJWT'

export class TipoTurnoRoutes {
  static get router(): Router {
    const router = Router()
    const tipoTurnoService = new TipoTurnoService()
    const controller = new TipoTurnoController(tipoTurnoService)

    router.use(ValidateJWT.validate)
    router.get('/', controller.getAllTipoTurnos)
    router.get(
      '/:id',
      [
        param(PARAMS_BODY.id)
          .isInt()
          .withMessage(validationMessages.notInteger('id_tipo')),
        ValidateFields.validate,
      ],
      controller.getTipoTurnoById
    )
    router.post(
      '/',
      [
        body(PARAMS_BODY.nombre)
          .notEmpty()
          .withMessage(validationMessages.required(PARAMS_BODY.nombre)),
        body(PARAMS_BODY.descripcion).optional(),
        ValidateFields.validate,
      ],
      controller.createTipoTurno
    )
    router.put(
      '/:id',
      [
        param(PARAMS_BODY.id)
          .isInt()
          .withMessage(validationMessages.notInteger('id_tipo')),
        body(PARAMS_BODY.nombre)
          .optional()
          .notEmpty()
          .withMessage(validationMessages.required(PARAMS_BODY.nombre)),
        body(PARAMS_BODY.descripcion).optional(),
        ValidateFields.validate,
      ],
      controller.updateTipoTurno
    )
    router.delete(
      '/:id',
      [
        param(PARAMS_BODY.id)
          .isInt()
          .withMessage(validationMessages.notInteger('id_tipo')),
        ValidateFields.validate,
      ],
      controller.deleteTipoTurno
    )

    return router
  }
}

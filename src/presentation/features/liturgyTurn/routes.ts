/* eslint-disable @typescript-eslint/comma-dangle */
/* eslint-disable @typescript-eslint/space-before-function-paren */
/* eslint-disable @typescript-eslint/no-extraneous-class */
import { Router } from 'express'
import { param, body } from 'express-validator'
import { validationMessages } from '../../../constants/validationMessage.c'
import { PARAMS_BODY } from '../../../constants/params.c'
import { ValidateFields } from '../../middleware/ValidateFields'
import { TurnoLiturgicoComunitarioController } from './controller'
import { TurnoLiturgicoComunitarioService } from '../../services/liturgyTurn.service'
import { ValidateJWT } from '../../middleware/validateJWT'

export class TurnoLiturgicoComunitarioRoutes {
  static get router(): Router {
    const router = Router()
    const service = new TurnoLiturgicoComunitarioService()
    const controller = new TurnoLiturgicoComunitarioController(service)

    router.use(ValidateJWT.validate)

    router.get('/', controller.getAll)

    router.get(
      '/:id',
      [
        param(PARAMS_BODY.id)
          .isInt()
          .withMessage(validationMessages.notInteger(PARAMS_BODY.id)),
        ValidateFields.validate,
      ],
      controller.getById
    )

    router.post(
      '/',
      [
        body(PARAMS_BODY.idComunidad)
          .notEmpty()
          .withMessage(validationMessages.required(PARAMS_BODY.idComunidad))
          .isInt()
          .withMessage(validationMessages.notInteger(PARAMS_BODY.idComunidad)),
        body(PARAMS_BODY.idTipoTurno)
          .notEmpty()
          .withMessage(validationMessages.required(PARAMS_BODY.idTipoTurno))
          .isInt()
          .withMessage(validationMessages.notInteger(PARAMS_BODY.idTipoTurno)),
        body(PARAMS_BODY.fechaIni)
          .notEmpty()
          .withMessage(validationMessages.required(PARAMS_BODY.fechaIni))
          .isISO8601()
          .toDate()
          .withMessage(validationMessages.notDate(PARAMS_BODY.fechaIni)),
        body(PARAMS_BODY.descripcion)
          .optional()
          .notEmpty()
          .withMessage(validationMessages.required(PARAMS_BODY.descripcion))
          .isString()
          .withMessage(validationMessages.notFound(PARAMS_BODY.descripcion)),
        body(PARAMS_BODY.fechaFin)
          .optional({ checkFalsy: true })
          .isISO8601()
          .toDate()
          .withMessage(validationMessages.notDate(PARAMS_BODY.fechaFin)),
        ValidateFields.validate,
      ],
      controller.create
    )

    router.put(
      '/:id',
      [
        param(PARAMS_BODY.id)
          .isInt()
          .withMessage(validationMessages.notInteger(PARAMS_BODY.id)),
        body(PARAMS_BODY.idComunidad)
          .optional()
          .isInt()
          .withMessage(validationMessages.notInteger(PARAMS_BODY.idComunidad)),
        body(PARAMS_BODY.idTipoTurno)
          .optional()
          .isInt()
          .withMessage(validationMessages.notInteger(PARAMS_BODY.idTipoTurno)),
        body(PARAMS_BODY.fechaIni)
          .optional({ checkFalsy: true })
          .isISO8601()
          .toDate()
          .withMessage(validationMessages.notDate(PARAMS_BODY.fechaIni)),
        body(PARAMS_BODY.descripcion)
          .optional()
          .isString()
          .withMessage(validationMessages.notFound(PARAMS_BODY.descripcion)),
        body(PARAMS_BODY.fechaFin)
          .optional({ checkFalsy: true })
          .isISO8601()
          .toDate()
          .withMessage(validationMessages.notDate(PARAMS_BODY.fechaFin)),
        ValidateFields.validate,
      ],
      controller.update
    )

    router.delete(
      '/:id',
      [
        param(PARAMS_BODY.id)
          .isInt()
          .withMessage(validationMessages.notInteger(PARAMS_BODY.id)),
        ValidateFields.validate,
      ],
      controller.delete
    )

    return router
  }
}

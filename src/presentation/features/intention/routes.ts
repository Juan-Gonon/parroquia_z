/* eslint-disable @typescript-eslint/no-extraneous-class */
import { Router } from 'express'
import { param, body } from 'express-validator'
import { validationMessages } from '../../../constants/validationMessage.c'
import { PARAMS_BODY } from '../../../constants/params.c'
import { ValidateFields } from '../../middleware/ValidateFields'
import { IntencionService } from '../../services/intention.service'
import { IntencionController } from './controller'

export class IntencionRoutes {
  static get router (): Router {
    const router = Router()
    const service = new IntencionService()
    const controller = new IntencionController(service)

    router.get('/', controller.getAll)

    router.get('/:id', [
      param(PARAMS_BODY.id)
        .isInt().withMessage(validationMessages.notInteger(PARAMS_BODY.id)),
      ValidateFields.validate
    ], controller.getById)

    router.post('/',
      [
        body(PARAMS_BODY.idFeligres)
          .notEmpty().withMessage(validationMessages.required(PARAMS_BODY.idFeligres))
          .isInt().withMessage(validationMessages.notInteger(PARAMS_BODY.idFeligres)),
        body(PARAMS_BODY.idEvento)
          .notEmpty().withMessage(validationMessages.required(PARAMS_BODY.idEvento))
          .isInt().withMessage(validationMessages.notInteger(PARAMS_BODY.idEvento)),
        body(PARAMS_BODY.idTipoIntencion)
          .notEmpty().withMessage(validationMessages.required(PARAMS_BODY.idTipoIntencion))
          .isInt().withMessage(validationMessages.notInteger(PARAMS_BODY.idTipoIntencion)),
        body(PARAMS_BODY.idEstadoIntencion)
          .notEmpty().withMessage(validationMessages.required(PARAMS_BODY.idEstadoIntencion))
          .isInt().withMessage(validationMessages.notInteger(PARAMS_BODY.idEstadoIntencion)),
        body(PARAMS_BODY.descripcion)
          .notEmpty().withMessage(validationMessages.required(PARAMS_BODY.descripcion))
          .isString().withMessage(validationMessages.notString(PARAMS_BODY.descripcion)),
        body(PARAMS_BODY.montoOfrenda)
          .optional({ checkFalsy: true })
          .isDecimal().withMessage(validationMessages.notDecimal(PARAMS_BODY.montoOfrenda)),
        body(PARAMS_BODY.pagada)
          .optional()
          .isBoolean().withMessage(validationMessages.notBoolean(PARAMS_BODY.pagada)),
        body(PARAMS_BODY.montoPagado)
          .optional({ checkFalsy: true })
          .isDecimal().withMessage(validationMessages.notDecimal(PARAMS_BODY.montoPagado)),
        body(PARAMS_BODY.fechaPago)
          .optional({ checkFalsy: true })
          .isISO8601().toDate().withMessage(validationMessages.notDate(PARAMS_BODY.fechaPago)),
        ValidateFields.validate
      ],
      controller.create)

    router.put('/:id',
      [
        param(PARAMS_BODY.id)
          .isInt().withMessage(validationMessages.notInteger(PARAMS_BODY.id)),
        body(PARAMS_BODY.idFeligres)
          .optional()
          .isInt().withMessage(validationMessages.notInteger(PARAMS_BODY.idFeligres)),
        body(PARAMS_BODY.idEvento)
          .optional({ checkFalsy: true })
          .isInt().withMessage(validationMessages.notInteger(PARAMS_BODY.idEvento)),
        body(PARAMS_BODY.idTipoIntencion)
          .optional()
          .isInt().withMessage(validationMessages.notInteger(PARAMS_BODY.idTipoIntencion)),
        body(PARAMS_BODY.idEstadoIntencion)
          .optional()
          .isInt().withMessage(validationMessages.notInteger(PARAMS_BODY.idEstadoIntencion)),
        body(PARAMS_BODY.descripcion)
          .optional()
          .isString().withMessage(validationMessages.notString(PARAMS_BODY.descripcion)),
        body(PARAMS_BODY.montoOfrenda)
          .optional({ checkFalsy: true })
          .isDecimal().withMessage(validationMessages.notDecimal(PARAMS_BODY.montoOfrenda)),
        body(PARAMS_BODY.pagada)
          .optional()
          .isBoolean().withMessage(validationMessages.notBoolean(PARAMS_BODY.pagada)),
        body(PARAMS_BODY.montoPagado)
          .optional({ checkFalsy: true })
          .isDecimal().withMessage(validationMessages.notDecimal(PARAMS_BODY.montoPagado)),
        body(PARAMS_BODY.fechaPago)
          .optional({ checkFalsy: true })
          .isISO8601().toDate().withMessage(validationMessages.notDate(PARAMS_BODY.fechaPago)),
        ValidateFields.validate
      ],
      controller.update)

    router.delete('/:id', [
      param(PARAMS_BODY.id)
        .isInt().withMessage(validationMessages.notInteger(PARAMS_BODY.id)),
      ValidateFields.validate
    ], controller.delete)

    return router
  }
}

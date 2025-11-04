/* eslint-disable @typescript-eslint/space-before-function-paren */
/* eslint-disable @typescript-eslint/comma-dangle */
/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Router } from 'express'
import { body, param, query } from 'express-validator'
import { PARAMS_BODY } from '../../../constants/params.c'
import { validationMessages } from '../../../constants/validationMessage.c'
import { ValidateFields } from '../../middleware/ValidateFields'
import { LiderComunitarioService } from '../../services/comunityLeader.service'
import { LiderComunitarioController } from './controller'
import { ValidateJWT } from '../../middleware/validateJWT'

export class LiderComunitarioRoutes {
  static get router(): Router {
    const router = Router()
    const liderComunitarioService = new LiderComunitarioService()
    const controller = new LiderComunitarioController(liderComunitarioService)

    router.use(ValidateJWT.validate)

    // Ruta para obtener todos los registros con paginación
    router.get(
      '/',
      [
        query('page')
          .isInt({ min: 1 })
          .optional()
          .withMessage(validationMessages.notInteger('page')),
        query('limit')
          .isInt({ min: 1 })
          .optional()
          .withMessage(validationMessages.notInteger('limit')),
        ValidateFields.validate,
      ],
      controller.getAllLideres
    )

    // Ruta para obtener un registro por su ID
    router.get(
      '/:id',
      [
        param(PARAMS_BODY.id)
          .isInt()
          .withMessage(validationMessages.notInteger('id_lider')),
        ValidateFields.validate,
      ],
      controller.getLiderById
    )

    // Ruta para crear un nuevo registro
    router.post(
      '/',
      [
        body(PARAMS_BODY.idPersonal)
          .isInt()
          .withMessage(validationMessages.notInteger(PARAMS_BODY.idPersonal)),
        body(PARAMS_BODY.idComunidad)
          .isInt()
          .withMessage(validationMessages.notInteger(PARAMS_BODY.idComunidad)),
        body(PARAMS_BODY.rolliderazgo)
          .notEmpty()
          .withMessage(validationMessages.required(PARAMS_BODY.rolliderazgo)),
        body(PARAMS_BODY.fechaIni)
          .isISO8601()
          .withMessage(validationMessages.notDate(PARAMS_BODY.fechaIni)),
        body(PARAMS_BODY.fechaFin)
          .optional({ checkFalsy: true })
          .isISO8601()
          .withMessage(validationMessages.notDate(PARAMS_BODY.fechaFin)),
        body(PARAMS_BODY.activo)
          .optional()
          .isBoolean()
          .withMessage(validationMessages.notBoolean(PARAMS_BODY.activo)),
        ValidateFields.validate,
      ],
      controller.createLider
    )

    // Ruta para actualizar un registro
    router.put(
      '/:id',
      [
        param(PARAMS_BODY.id)
          .isInt()
          .withMessage(validationMessages.notInteger('id_lider')),
        body(PARAMS_BODY.idPersonal)
          .optional()
          .isInt()
          .withMessage(validationMessages.notInteger(PARAMS_BODY.idPersonal)),
        body(PARAMS_BODY.idComunidad)
          .optional()
          .isInt()
          .withMessage(validationMessages.notInteger(PARAMS_BODY.idComunidad)),
        body(PARAMS_BODY.rolliderazgo)
          .optional()
          .notEmpty()
          .withMessage(validationMessages.required(PARAMS_BODY.rolliderazgo)),
        body(PARAMS_BODY.fechaIni)
          .optional()
          .isISO8601()
          .withMessage(validationMessages.notDate(PARAMS_BODY.fechaIni)),
        body(PARAMS_BODY.fechaFin)
          .optional({ checkFalsy: true })
          .isISO8601()
          .withMessage(validationMessages.notDate(PARAMS_BODY.fechaFin)),
        body(PARAMS_BODY.activo)
          .optional()
          .isBoolean()
          .withMessage(validationMessages.notBoolean(PARAMS_BODY.activo)),
        ValidateFields.validate,
      ],
      controller.updateLider
    )

    // Ruta para eliminar un registro
    router.delete(
      '/:id',
      [
        param(PARAMS_BODY.id)
          .isInt()
          .withMessage(validationMessages.notInteger('id_lider')),
        ValidateFields.validate,
      ],
      controller.deleteLider
    )

    return router
  }
}

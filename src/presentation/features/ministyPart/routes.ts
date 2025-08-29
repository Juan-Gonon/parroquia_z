/* eslint-disable @typescript-eslint/no-extraneous-class */
import { Router } from 'express'
import { param, body } from 'express-validator'
import { PARAMS_BODY } from '../../../constants/params.c'
import { validationMessages } from '../../../constants/validationMessage.c'
import { ValidateFields } from '../../middleware/ValidateFields'
import { ParticipacionMinisterioController } from './controller'
import { ParticipacionMinisterioService } from '../../services/ministryP.service'

export class ParticipacionMinisterioRoutes {
  static get router (): Router {
    const router = Router()
    const participacionMinisterioService = new ParticipacionMinisterioService()
    const controller = new ParticipacionMinisterioController(participacionMinisterioService)

    // Ruta para obtener todas las participaciones de ministerio
    router.get('/', controller.getAllParticipaciones)

    // Ruta para obtener una participación por su ID
    router.get(
      '/:id',
      [
        param(PARAMS_BODY.id)
          .isInt()
          .withMessage(validationMessages.notInteger('id_part_min')),
        ValidateFields.validate
      ],
      controller.getParticipacionById
    )

    // Ruta para crear una nueva participación de ministerio
    router.post(
      '/',
      [
        body(PARAMS_BODY.idPersonal)
          .isInt()
          .withMessage(validationMessages.notInteger(PARAMS_BODY.idPersonal)),
        body(PARAMS_BODY.idMinisterio)
          .isInt()
          .withMessage(validationMessages.notInteger(PARAMS_BODY.idMinisterio)),
        body(PARAMS_BODY.idRol)
          .isInt()
          .withMessage(validationMessages.notInteger(PARAMS_BODY.idRol)),
        body(PARAMS_BODY.fechaIni)
          .isISO8601()
          .withMessage(validationMessages.notDate(PARAMS_BODY.fechaIni)),
        body(PARAMS_BODY.fechaFin)
          .optional()
          .isISO8601()
          .withMessage(validationMessages.notDate(PARAMS_BODY.fechaFin)),
        body(PARAMS_BODY.activo)
          .optional()
          .isBoolean()
          .withMessage(validationMessages.notBoolean(PARAMS_BODY.activo)),
        ValidateFields.validate
      ],
      controller.createParticipacion
    )

    // Ruta para actualizar una participación de ministerio
    router.put(
      '/:id',
      [
        param(PARAMS_BODY.id)
          .isInt()
          .withMessage(validationMessages.notInteger('id_part_min')),
        body(PARAMS_BODY.idPersonal)
          .optional()
          .isInt()
          .withMessage(validationMessages.notInteger(PARAMS_BODY.idPersonal)),
        body(PARAMS_BODY.idMinisterio)
          .optional()
          .isInt()
          .withMessage(validationMessages.notInteger(PARAMS_BODY.idMinisterio)),
        body(PARAMS_BODY.idRol)
          .optional()
          .isInt()
          .withMessage(validationMessages.notInteger(PARAMS_BODY.idRol)),
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
        ValidateFields.validate
      ],
      controller.updateParticipacion
    )

    // Ruta para eliminar una participación de ministerio por su ID
    router.delete(
      '/:id',
      [
        param(PARAMS_BODY.id)
          .isInt()
          .withMessage(validationMessages.notInteger('id_part_min')),
        ValidateFields.validate
      ],
      controller.deleteParticipacion
    )

    return router
  }
}

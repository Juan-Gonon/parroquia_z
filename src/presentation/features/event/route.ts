/* eslint-disable @typescript-eslint/comma-dangle */
/* eslint-disable @typescript-eslint/space-before-function-paren */
/* eslint-disable @typescript-eslint/no-extraneous-class */
import { Router } from 'express'
import { param, body } from 'express-validator'
import { PARAMS_BODY } from '../../../constants/params.c'
import { validationMessages } from '../../../constants/validationMessage.c'
import { ValidateFields } from '../../middleware/ValidateFields'
import { EventoService } from '../../services/event.service'
import { EventoController } from './controller'
import { ValidateJWT } from '../../middleware/validateJWT'

export class EventoRoutes {
  static get router(): Router {
    const router = Router()
    const eventoService = new EventoService()
    const controller = new EventoController(eventoService)

    router.use(ValidateJWT.validate)

    // Ruta para obtener todos los eventos
    router.get('/', controller.getAllEvents)

    // proximos eventos
    router.get('/upcoming', controller.getUpcomingEvents)

    // Ruta para obtener un evento por su ID
    router.get(
      '/:id',
      [
        param(PARAMS_BODY.id)
          .isInt()
          .withMessage(validationMessages.notInteger('id_evento')),
        ValidateFields.validate,
      ],
      controller.getEventById
    )

    // Ruta para crear un nuevo evento
    router.post(
      '/',
      [
        body(PARAMS_BODY.nombre)
          .notEmpty()
          .withMessage(validationMessages.required(PARAMS_BODY.nombre)),
        body(PARAMS_BODY.fechaIni)
          .isISO8601()
          .withMessage(validationMessages.notDate(PARAMS_BODY.fechaIni)),
        body(PARAMS_BODY.fechaFin)
          .optional()
          .isISO8601()
          .withMessage(validationMessages.notDate(PARAMS_BODY.fechaFin)),
        body(PARAMS_BODY.descripcion).optional(),
        body(PARAMS_BODY.idComunidad)
          .isInt()
          .withMessage(validationMessages.notInteger(PARAMS_BODY.idTipoEvento)),
        body(PARAMS_BODY.idTipoEvento)
          .isInt()
          .withMessage(validationMessages.notInteger(PARAMS_BODY.id)),
        body(PARAMS_BODY.aceptaintenciones)
          .optional()
          .isBoolean()
          .withMessage(
            validationMessages.notBoolean(PARAMS_BODY.aceptaintenciones)
          ),
        body(PARAMS_BODY.requiereinscripcion)
          .optional()
          .isBoolean()
          .withMessage(
            validationMessages.notBoolean(PARAMS_BODY.requiereinscripcion)
          ),
        body(PARAMS_BODY.idCelebrante)
          .optional({ checkFalsy: true })
          .isInt()
          .withMessage(validationMessages.notInteger(PARAMS_BODY.idCelebrante)),
        body(PARAMS_BODY.nombrecelebranteexterno).optional({
          checkFalsy: true,
        }),
        ValidateFields.validate,
      ],
      controller.createEvent
    )

    // Ruta para actualizar un evento
    router.put(
      '/:id',
      [
        param(PARAMS_BODY.id)
          .isInt()
          .withMessage(validationMessages.notInteger('id_evento')),
        body(PARAMS_BODY.nombre).optional(),
        body(PARAMS_BODY.fechaIni)
          .optional()
          .isISO8601()
          .withMessage(validationMessages.notDate(PARAMS_BODY.fechaIni)),
        body(PARAMS_BODY.fechaFin)
          .optional({ checkFalsy: true })
          .isISO8601()
          .withMessage(validationMessages.notDate(PARAMS_BODY.fechaFin)),
        body(PARAMS_BODY.descripcion).optional(),
        body(PARAMS_BODY.idComunidad)
          .optional()
          .isInt()
          .withMessage(validationMessages.notInteger(PARAMS_BODY.idComunidad)),
        body(PARAMS_BODY.idTipoEvento)
          .optional()
          .isInt()
          .withMessage(validationMessages.notInteger(PARAMS_BODY.idTipoEvento)),
        body(PARAMS_BODY.aceptaintenciones)
          .optional()
          .isBoolean()
          .withMessage(
            validationMessages.notBoolean(PARAMS_BODY.aceptaintenciones)
          ),
        body(PARAMS_BODY.requiereinscripcion)
          .optional()
          .isBoolean()
          .withMessage(
            validationMessages.notBoolean(PARAMS_BODY.requiereinscripcion)
          ),
        body(PARAMS_BODY.idCelebrante)
          .optional({ checkFalsy: true })
          .isInt()
          .withMessage(validationMessages.notInteger(PARAMS_BODY.idCelebrante)),
        body(PARAMS_BODY.nombrecelebranteexterno).optional({
          checkFalsy: true,
        }),
        ValidateFields.validate,
      ],
      controller.updateEvent
    )

    // Ruta para eliminar un evento por su ID
    router.delete(
      '/:id',
      [
        param(PARAMS_BODY.id)
          .isInt()
          .withMessage(validationMessages.notInteger('id_evento')),
        ValidateFields.validate,
      ],
      controller.deleteEvent
    )

    return router
  }
}

/* eslint-disable @typescript-eslint/no-extraneous-class */
import { Router } from 'express'
import { param, body } from 'express-validator'
import { PARAMS_BODY } from '../../../constants/params.c'
import { validationMessages } from '../../../constants/validationMessage.c'
import { ValidateFields } from '../../middleware/ValidateFields'
import { TipoEventoController } from './controller'
import { TipoEventoService } from '../../services/eventType.service'

// Clase que contiene las rutas para la gestión de TipoEvento
export class EventTypeRoutes {
  // Define un método estático para obtener el router
  static get router (): Router {
    const router = Router()
    const tipoEventoService = new TipoEventoService()
    const controller = new TipoEventoController(tipoEventoService)

    // Ruta para obtener todos los tipos de evento
    router.get('/', controller.getAllTipoEventos)

    // Ruta para obtener un tipo de evento por su ID
    router.get(
      '/:id',
      [
        param(PARAMS_BODY.id)
          .isInt()
          .withMessage(validationMessages.notInteger('id_tipo')),
        ValidateFields.validate
      ],
      controller.getTipoEventoById
    )

    // Ruta para crear un nuevo tipo de evento
    router.post(
      '/',
      [
        body(PARAMS_BODY.nombre)
          .notEmpty()
          .withMessage(validationMessages.required(PARAMS_BODY.nombre)),
        body(PARAMS_BODY.descripcion).optional().notEmpty(),
        ValidateFields.validate
      ],
      controller.createTipoEvento
    )

    // Ruta para actualizar un tipo de evento
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
        body(PARAMS_BODY.descripcion).optional().notEmpty(),
        ValidateFields.validate
      ],
      controller.updateTipoEvento
    )

    // Ruta para eliminar un tipo de evento por su ID
    // Se valida que el 'id' sea un número entero
    router.delete(
      '/:id',
      [
        param(PARAMS_BODY.id)
          .isInt()
          .withMessage(validationMessages.notInteger('id_tipo')),
        ValidateFields.validate
      ],
      controller.deleteTipoEvento
    )

    return router
  }
}

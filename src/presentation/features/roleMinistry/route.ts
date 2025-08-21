/* eslint-disable @typescript-eslint/no-extraneous-class */
import { Router } from 'express'
import { param, body } from 'express-validator'
import { PARAMS_BODY } from '../../../constants/params.c'
import { validationMessages } from '../../../constants/validationMessage.c'
import { ValidateFields } from '../../middleware/ValidateFields'
import { RolDentroMinisterioService } from '../../services/roleMinistery.service'
import { RolDentroMinisterioController } from './controller'

export class RolDentroMinisterioRoutes {
  // Define un método estático para obtener el router
  static get router (): Router {
    const router = Router()
    const rolDentroMinisterioService = new RolDentroMinisterioService()
    const controller = new RolDentroMinisterioController(rolDentroMinisterioService)

    // Ruta para obtener todos los roles dentro de un ministerio
    router.get('/', controller.getAllRoles)

    router.get(
      '/:id',
      [
        param(PARAMS_BODY.id)
          .isInt()
          .withMessage(validationMessages.notInteger('id_roldentroministerio')),
        ValidateFields.validate
      ],
      controller.getRolById
    )

    // Ruta para crear un nuevo rol dentro de un ministerio
    router.post(
      '/',
      [
        body(PARAMS_BODY.nombre)
          .notEmpty()
          .withMessage(validationMessages.required(PARAMS_BODY.nombre)),
        body(PARAMS_BODY.descripcion).optional(),
        ValidateFields.validate
      ],
      controller.createRol
    )

    router.put(
      '/:id',
      [
        param(PARAMS_BODY.id)
          .isInt()
          .withMessage(validationMessages.notInteger('id_roldentroministerio')),
        body(PARAMS_BODY.nombre)
          .optional()
          .notEmpty()
          .withMessage(validationMessages.required(PARAMS_BODY.nombre)),
        body(PARAMS_BODY.descripcion).optional(),
        ValidateFields.validate
      ],
      controller.updateRol
    )

    // Ruta para eliminar un rol dentro de un ministerio por su ID
    router.delete(
      '/:id',
      [
        param(PARAMS_BODY.id)
          .isInt()
          .withMessage(validationMessages.notInteger('id_roldentroministerio')),
        ValidateFields.validate
      ],
      controller.deleteRol
    )

    return router
  }
}

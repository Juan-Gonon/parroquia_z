/* eslint-disable @typescript-eslint/no-extraneous-class */
import { Router } from 'express'
import { param, body } from 'express-validator'
import { PARAMS_BODY } from '../../../constants/params.c'
import { validationMessages } from '../../../constants/validationMessage.c'
import { ValidateFields } from '../../middleware/ValidateFields'
import { RolPersonalController } from './controller'
import { RolPersonalService } from '../../services/RolPersonal.service'

export class RolPersonalRoutes {
  // Define un método estático para obtener el router
  static get router (): Router {
    const router = Router()
    const rolPersonalService = new RolPersonalService()
    const controller = new RolPersonalController(rolPersonalService)

    // Ruta para obtener todos los roles de personal
    router.get('/', controller.getAllRoles)

    // Ruta para obtener un rol de personal por su ID
    router.get(
      '/:id',
      [
        param(PARAMS_BODY.id)
          .isInt()
          .withMessage(validationMessages.notInteger('id_rol')),
        ValidateFields.validate
      ],
      controller.getRolById
    )

    // Ruta para crear un nuevo rol de personal
    router.post(
      '/',
      [
        body(PARAMS_BODY.nombre)
          .notEmpty()
          .withMessage(validationMessages.required(PARAMS_BODY.nombre)),
        body(PARAMS_BODY.descripcion).optional(),
        body(PARAMS_BODY.permisos)
          .optional()
          .isString()
          .withMessage('The "permisos" field must be a string.'),
        ValidateFields.validate
      ],
      controller.createRol
    )

    // Ruta para actualizar un rol de personal
    router.put(
      '/:id',
      [
        param(PARAMS_BODY.id)
          .isInt()
          .withMessage(validationMessages.notInteger('id_rol')),
        body(PARAMS_BODY.nombre)
          .optional()
          .notEmpty()
          .withMessage(validationMessages.required(PARAMS_BODY.nombre)),
        body(PARAMS_BODY.descripcion).optional(),
        body(PARAMS_BODY.permisos)
          .optional()
          .isString()
          .withMessage('The "permisos" field must be a string.'),
        ValidateFields.validate
      ],
      controller.updateRol
    )

    // Ruta para eliminar un rol de personal por su ID
    router.delete(
      '/:id',
      [
        param(PARAMS_BODY.id)
          .isInt()
          .withMessage(validationMessages.notInteger('id_rol')),
        ValidateFields.validate
      ],
      controller.deleteRol
    )

    return router
  }
}

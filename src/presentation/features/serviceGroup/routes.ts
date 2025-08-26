/* eslint-disable @typescript-eslint/no-extraneous-class */
import { Router } from 'express'
import { param, body } from 'express-validator'
import { PARAMS_BODY } from '../../../constants/params.c'
import { validationMessages } from '../../../constants/validationMessage.c'
import { GrupoServicioController } from './controller'
import { ValidateFields } from '../../middleware/ValidateFields'
import { GrupoServicioService } from '../../services/serviceGroup.service'

export class GrupoServicioRoutes {
  static get router (): Router {
    const router = Router()
    const grupoServicioService = new GrupoServicioService()
    const controller = new GrupoServicioController(grupoServicioService)

    // Ruta para obtener todos los grupos de servicio
    router.get('/', controller.getAllGroups)

    // Ruta para obtener un grupo de servicio por su ID
    router.get(
      '/:id',
      [
        param(PARAMS_BODY.id)
          .isInt()
          .withMessage(validationMessages.notInteger('id_grupo')),
        ValidateFields.validate
      ],
      controller.getGroupById
    )

    // Ruta para crear un nuevo grupo de servicio
    router.post(
      '/',
      [
        body(PARAMS_BODY.nombre)
          .notEmpty()
          .withMessage(validationMessages.required(PARAMS_BODY.nombre)),
        body(PARAMS_BODY.descripcion).optional(),
        body(PARAMS_BODY.activo)
          .optional()
          .isBoolean()
          .withMessage(validationMessages.notBoolean(PARAMS_BODY.activo)),
        body(PARAMS_BODY.idMinisterio)
          .notEmpty().isInt()
          .withMessage(validationMessages.required(PARAMS_BODY.idMinisterio)),
        ValidateFields.validate
      ],
      controller.createGroup
    )

    // Ruta para actualizar un grupo de servicio
    router.put(
      '/:id',
      [
        param(PARAMS_BODY.id)
          .isInt()
          .withMessage(validationMessages.notInteger('id_grupo')),
        body(PARAMS_BODY.nombre).optional(),
        body(PARAMS_BODY.descripcion).optional(),
        body(PARAMS_BODY.activo)
          .optional()
          .isBoolean()
          .withMessage(validationMessages.notBoolean(PARAMS_BODY.activo)),
        body(PARAMS_BODY.idMinisterio)
          .optional().isInt()
          .withMessage(validationMessages.notInteger(PARAMS_BODY.idMinisterio)),
        ValidateFields.validate
      ],
      controller.updateGroup
    )

    // Ruta para eliminar un grupo de servicio por su ID
    router.delete(
      '/:id',
      [
        param(PARAMS_BODY.id)
          .isInt()
          .withMessage(validationMessages.notInteger('id_grupo')),
        ValidateFields.validate
      ],
      controller.deleteGroup
    )

    return router
  }
}

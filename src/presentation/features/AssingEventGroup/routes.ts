/* eslint-disable @typescript-eslint/comma-dangle */
/* eslint-disable @typescript-eslint/space-before-function-paren */
/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Router } from 'express'
import { body, param, query } from 'express-validator'
import { PARAMS_BODY } from '../../../constants/params.c'
import { validationMessages } from '../../../constants/validationMessage.c'
import { ValidateFields } from '../../middleware/ValidateFields'
import { AsigGrupoEventoService } from '../../services/asigEventGroup.service'
import { AsigGrupoEventoController } from './controller'
import { ValidateJWT } from '../../middleware/validateJWT'

export class AsigGrupoEventoRoutes {
  static get router(): Router {
    const router = Router()
    const asigGrupoEventoService = new AsigGrupoEventoService()
    const controller = new AsigGrupoEventoController(asigGrupoEventoService)

    router.use(ValidateJWT.validate)

    // Ruta para obtener todos los registros
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
      controller.getAllAsignaciones
    )

    // Ruta para obtener un registro por su ID
    router.get(
      '/:id',
      [
        param(PARAMS_BODY.id)
          .isInt()
          .withMessage(validationMessages.notInteger('id_asig_ge')),
        ValidateFields.validate,
      ],
      controller.getAsignacionById
    )

    // Ruta para crear un nuevo registro
    router.post(
      '/',
      [
        body(PARAMS_BODY.idEvento)
          .isInt()
          .withMessage(validationMessages.notInteger(PARAMS_BODY.idEvento)),
        body(PARAMS_BODY.idGrpSrv)
          .isInt()
          .withMessage(validationMessages.notInteger(PARAMS_BODY.idGrpSrv)),
        body(PARAMS_BODY.notas)
          .optional()
          .isString()
          .withMessage(validationMessages.required(PARAMS_BODY.notas)),
        ValidateFields.validate,
      ],
      controller.createAsignacion
    )

    // Ruta para actualizar un registro
    router.put(
      '/:id',
      [
        param(PARAMS_BODY.id)
          .isInt()
          .withMessage(validationMessages.notInteger('id_asig_ge')),
        body(PARAMS_BODY.idEvento)
          .optional()
          .isInt()
          .withMessage(validationMessages.notInteger(PARAMS_BODY.idEvento)),
        body(PARAMS_BODY.idGrpSrv)
          .optional()
          .isInt()
          .withMessage(validationMessages.notInteger(PARAMS_BODY.idGrpSrv)),
        body(PARAMS_BODY.notas)
          .optional()
          .isString()
          .withMessage(validationMessages.required(PARAMS_BODY.notas)),
        ValidateFields.validate,
      ],
      controller.updateAsignacion
    )

    // Ruta para eliminar un registro
    router.delete(
      '/:id',
      [
        param(PARAMS_BODY.id)
          .isInt()
          .withMessage(validationMessages.notInteger('id_asig_ge')),
        ValidateFields.validate,
      ],
      controller.deleteAsignacion
    )

    return router
  }
}

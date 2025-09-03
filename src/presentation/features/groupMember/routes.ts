/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Router } from 'express'
import { body, param, query } from 'express-validator'
import { PARAMS_BODY } from '../../../constants/params.c'
import { validationMessages } from '../../../constants/validationMessage.c'
import { ValidateFields } from '../../middleware/ValidateFields'
import { MiembroGrupoController } from './controller'
import { MiembroGrupoService } from '../../services/groupMember.service'

export class MiembroGrupoRoutes {
  static get router (): Router {
    const router = Router()
    const miembroGrupoService = new MiembroGrupoService()
    const controller = new MiembroGrupoController(miembroGrupoService)

    router.get(
      '/',
      [
        query('page').isInt({ min: 1 }).optional().withMessage(validationMessages.notInteger('page')),
        query('limit').isInt({ min: 1 }).optional().withMessage(validationMessages.notInteger('limit')),
        ValidateFields.validate
      ],
      controller.getAllMiembros
    )

    // Ruta para obtener un registro por su ID
    router.get(
      '/:id',
      [
        param(PARAMS_BODY.id).isInt().withMessage(validationMessages.notInteger('id_miembrogrupo')),
        ValidateFields.validate
      ],
      controller.getMiembroById
    )

    // Ruta para crear un nuevo registro
    router.post(
      '/',
      [
        body(PARAMS_BODY.idPartMin).isInt().withMessage(validationMessages.notInteger(PARAMS_BODY.idPartMin)),
        body(PARAMS_BODY.idGrupoServicio).isInt().withMessage(validationMessages.notInteger(PARAMS_BODY.idGrupoServicio)),
        body(PARAMS_BODY.fechaIni).isISO8601().withMessage(validationMessages.notDate(PARAMS_BODY.fechaIni)),
        body(PARAMS_BODY.roldentrogrupo).notEmpty().withMessage(validationMessages.required(PARAMS_BODY.roldentrogrupo)),
        body(PARAMS_BODY.fechaFin).optional({ checkFalsy: true }).isISO8601().withMessage(validationMessages.notDate(PARAMS_BODY.fechaFin)),
        body(PARAMS_BODY.activo).optional().isBoolean().withMessage(validationMessages.notBoolean(PARAMS_BODY.activo)),
        ValidateFields.validate
      ],
      controller.createMiembro
    )

    // Ruta para actualizar un registro
    router.put(
      '/:id',
      [
        param(PARAMS_BODY.id).isInt().withMessage(validationMessages.notInteger('id_miembrogrupo')),
        body(PARAMS_BODY.idPartMin).optional().isInt().withMessage(validationMessages.notInteger(PARAMS_BODY.idPartMin)),
        body(PARAMS_BODY.idGrupoServicio).optional().isInt().withMessage(validationMessages.notInteger(PARAMS_BODY.idGrupoServicio)),
        body(PARAMS_BODY.fechaIni).optional().isISO8601().withMessage(validationMessages.notDate(PARAMS_BODY.fechaIni)),
        body(PARAMS_BODY.roldentrogrupo).optional().notEmpty().withMessage(validationMessages.required(PARAMS_BODY.roldentrogrupo)),
        body(PARAMS_BODY.fechaFin).optional({ checkFalsy: true }).isISO8601().withMessage(validationMessages.notDate(PARAMS_BODY.fechaFin)),
        body(PARAMS_BODY.activo).optional().isBoolean().withMessage(validationMessages.notBoolean(PARAMS_BODY.activo)),
        ValidateFields.validate
      ],
      controller.updateMiembro
    )

    // Ruta para eliminar un registro
    router.delete(
      '/:id',
      [
        param(PARAMS_BODY.id).isInt().withMessage(validationMessages.notInteger('id_miembrogrupo')),
        ValidateFields.validate
      ],
      controller.deleteMiembro
    )

    return router
  }
}

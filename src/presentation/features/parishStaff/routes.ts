/* eslint-disable @typescript-eslint/no-extraneous-class */
import { Router } from 'express'
import { param, body } from 'express-validator'
import { PARAMS_BODY } from '../../../constants/params.c'
import { validationMessages } from '../../../constants/validationMessage.c'
import { ValidateFields } from '../../middleware/ValidateFields'
import { PersonalParroquialService } from '../../services/parishStaff.service'
import { PersonalParroquialController } from './controller'

export class PersonalParroquialRoutes {
  static get router (): Router {
    const router = Router()
    const personalParroquialService = new PersonalParroquialService()
    const controller = new PersonalParroquialController(personalParroquialService)

    // Ruta para obtener todo el personal parroquial
    router.get('/', controller.getAllPersonal)

    // Ruta para obtener un registro de personal parroquial por su ID
    router.get(
      '/:id',
      [
        param(PARAMS_BODY.id)
          .isInt()
          .withMessage(validationMessages.notInteger('id_personal')),
        ValidateFields.validate
      ],
      controller.getPersonalById
    )

    // Ruta para crear un nuevo registro de personal parroquial
    router.post(
      '/',
      [
        body(PARAMS_BODY.nombre)
          .notEmpty()
          .withMessage(validationMessages.required(PARAMS_BODY.nombre)),
        body(PARAMS_BODY.apellido)
          .notEmpty()
          .withMessage(validationMessages.required(PARAMS_BODY.apellido)),
        body(PARAMS_BODY.direccion).optional(),
        body(PARAMS_BODY.telefono).optional(),
        body(PARAMS_BODY.email)
          .optional()
          .isEmail()
          .withMessage(validationMessages.invalidEmail(PARAMS_BODY.email)),
        ValidateFields.validate
      ],
      controller.createPersonal
    )

    // Ruta para actualizar un registro de personal parroquial
    router.put(
      '/:id',
      [
        param(PARAMS_BODY.id)
          .isInt()
          .withMessage(validationMessages.notInteger('id_personal')),
        body(PARAMS_BODY.nombre).optional(),
        body(PARAMS_BODY.apellido).optional(),
        body(PARAMS_BODY.direccion).optional(),
        body(PARAMS_BODY.telefono).optional(),
        body(PARAMS_BODY.email)
          .optional()
          .isEmail()
          .withMessage(validationMessages.invalidEmail(PARAMS_BODY.email)),
        ValidateFields.validate
      ],
      controller.updatePersonal
    )

    // Ruta para eliminar un registro de personal parroquial por su ID
    router.delete(
      '/:id',
      [
        param(PARAMS_BODY.id)
          .isInt()
          .withMessage(validationMessages.notInteger('id_personal')),
        ValidateFields.validate
      ],
      controller.deletePersonal
    )

    return router
  }
}

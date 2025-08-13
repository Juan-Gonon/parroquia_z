/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'

export class ValidateFields {
  static validate (req: Request, res: Response, next: NextFunction): void {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      res.status(400).json({
        ok: false,
        error: errors.mapped()
      })
      return
    }

    return next()
  }
}

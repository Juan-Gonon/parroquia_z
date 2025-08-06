/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Request, Response } from 'express'
import { CustomError } from '../../../domain'
import { LoginUserDTO } from '../../../domain/DTOs'
import { AuthService } from '../../services/auth.service'

export class AuhtController {
  constructor (private readonly authService: AuthService) {}

  private readonly handleError = (error: unknown, res: Response): Response => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message })
    }
    return res.status(500).json({ error: 'Internal server' })
  }

  loginUser = async (req: Request, res: Response): Promise<Response> => {
    const [error, loginDto] = LoginUserDTO.login(req.body)

    if (error) return this.handleError(CustomError.badRequest(error), res)

    return await this.authService
      .loginUser(loginDto!)
      .then((user) => res.json(user))
      .catch((error) => this.handleError(error, res))
  }
}

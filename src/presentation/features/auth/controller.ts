import { Request, Response } from 'express'
import { CustomError } from '../../../domain'
import { LoginUserDTO } from '../../../domain/DTOs'

export class AuhtController {
  private readonly handleError = (error: unknown, res: Response): Response => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message })
    }
    return res.status(500).json({ error: 'Internal server' })
  }

  loginUser = async (req: Request, res: Response): Promise<Response> => {
    const [error, loginDto] = LoginUserDTO.login(req.body)

    console.log(error)
    if (error !== undefined) return this.handleError(CustomError.badRequest(error), res)

    console.log(loginDto)

    // this.authService
    //   .loginUser(loginDto)
    //   .then((user) => res.json(user))
    //   .catch((error) => this.handleError(error, res))

    return res.json(loginDto)
  }
}

/* eslint-disable @typescript-eslint/space-before-function-paren */
import { Response, Request } from 'express'
import { handleError } from '../../../domain'
import { StateIntentionService } from '../../services/stateIntention.service'

export class SatateIntentionController {
  constructor(private readonly stateIntentionService: StateIntentionService) {}
  public getAllStateIntention = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const data = await this.stateIntentionService.getAllStateIntention()

      return res.status(200).json(data)
    } catch (error) {
      return handleError(error, res)
    }
  }
}

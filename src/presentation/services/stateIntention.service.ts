/* eslint-disable @typescript-eslint/space-before-function-paren */
import { prisma } from '../../data/postgress'
import { CustomError } from '../../domain'

export class StateIntentionService {
  public async getAllStateIntention(): Promise<any> {
    try {
      const data = prisma.estadointencion.findMany()

      return await data
    } catch (error) {
      if (error instanceof CustomError) throw error

      throw CustomError.internalServer('Internal server error')
    }
  }
}

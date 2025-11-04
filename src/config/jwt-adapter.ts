/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-extraneous-class */
import jwt from 'jsonwebtoken'
import { envs } from './envs'

const JWT_SEED = envs.JWT_SEED

export class JwtAdapter {
  static async generateToken (payload: any): Promise<string | null> {
    return await new Promise((resolve) => {
      jwt.sign(payload, JWT_SEED, { expiresIn: '2h' }, (err: any, token: any) => {
        if (err) return resolve(null)

        resolve(token!)
      })
    })
  }

  static async validateToken<T>(token: string): Promise<T | null > {
    return await new Promise((resolve) => {
      jwt.verify(token, JWT_SEED, (err, decoded) => {
        if (err) return resolve(null)

        resolve(decoded as T)
      })
    })
  }
}

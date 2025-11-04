import 'dotenv/config'
import * as env from 'env-var'

export const envs = {
  PORT: env.get('PORT').required().asPortNumber(),
  PUBLIC_PATH: env.get('PUBLIC_PATH').required().asString(),
  JWT_SEED: env.get('JWT_SEED').required().asString()
}

import { Server } from '../../src/presentation/Server'
import { envs } from '../../src/config'
import { AppRouter } from '../../src/routers/routes'

export const testServer = new Server({
  port: envs.PORT,
  publicPath: envs.PUBLIC_PATH,
  routes: AppRouter.routes
})

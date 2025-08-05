import { envs } from './config/envs'
import { Server } from './presentation/Server'
import { AppRouter } from './routers/routes'

void (async () => {
  void main()
})()

async function main (): Promise<void> {
  const server = new Server({ port: envs.PORT, publicPath: envs.PUBLIC_PATH, routes: AppRouter.routes })

  await server.start()
}

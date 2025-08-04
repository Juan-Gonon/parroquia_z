import { envs } from './config/envs'
import { Server } from './presentation/Server'

void (async () => {
  void main()
})()

async function main (): Promise<void> {
  const server = new Server({ port: envs.PORT, publicPath: envs.PUBLIC_PATH })

  await server.start()
}

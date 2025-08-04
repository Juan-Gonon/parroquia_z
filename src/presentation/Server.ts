import express from 'express'

interface Options {
  port: number
  publicPath: string
//   routes: Router
}

export class Server {
  private readonly app = express()
  private readonly PORT: number
  private readonly PUBLIC_PATH: string

  constructor ({ port, publicPath }: Options) {
    this.PORT = port
    this.PUBLIC_PATH = publicPath
  }

  start = async (): Promise<void> => {
    this.app.use(express.static(this.PUBLIC_PATH))

    this.app.listen(this.PORT, () => {
      console.log(`Server running on port ${this.PORT}`)
    })
  }
}

import express, { Router } from 'express'

interface Options {
  port: number
  publicPath: string
  routes: Router
}

export class Server {
  private readonly app = express()
  private readonly PORT: number
  private readonly PUBLIC_PATH: string
  private readonly routes: Router

  constructor ({ port, publicPath, routes }: Options) {
    this.PORT = port
    this.PUBLIC_PATH = publicPath
    this.routes = routes
  }

  start = async (): Promise<void> => {
    //* Middlewares
    this.app.use(express.json()) // raw
    this.app.use(express.urlencoded({ extended: true })) // x-www-form-urlencoded

    this.app.use(express.static(this.PUBLIC_PATH))

    this.app.use(this.routes)

    this.app.listen(this.PORT, () => {
      console.log(`Server running on port ${this.PORT}`)
    })
  }
}

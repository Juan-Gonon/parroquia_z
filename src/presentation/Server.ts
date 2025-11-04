/* eslint-disable @typescript-eslint/comma-dangle */
/* eslint-disable @typescript-eslint/space-before-function-paren */
import express, { Router } from 'express'
import cors from 'cors'

interface Options {
  port: number
  publicPath: string
  routes: Router
}

export class Server {
  public readonly app = express()
  private readonly PORT: number
  private readonly PUBLIC_PATH: string
  private readonly routes: Router
  private serverListener?: any

  constructor({ port, publicPath, routes }: Options) {
    this.PORT = port
    this.PUBLIC_PATH = publicPath
    this.routes = routes
  }

  start = async (): Promise<void> => {
    //* Middlewares
    this.app.use(express.json()) // raw
    this.app.use(express.urlencoded({ extended: true })) // x-www-form-urlencoded

    this.app.use(express.static(this.PUBLIC_PATH))

    this.app.use(
      cors({
        origin: 'http://localhost:5173', // frontend Vite
        credentials: true, // cookies o headers de auth
      })
    )

    this.app.use(this.routes)

    this.serverListener = this.app.listen(this.PORT, () => {
      console.log(`Server running on port ${this.PORT}`)
    })
  }

  public close(): void {
    this.serverListener?.close()
  }
}

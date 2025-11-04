import { Request } from 'express'

export interface RawUserFromDB {
  id_usuario: number
  usuarioacceso: string
  contrasena: string
}

export interface UserServiceR {
  idUsuario: number
  usuarioacceso: string
  token: string
}

export interface payloadJWT {
  idUsuario: number
  usuarioacceso: string
}

export interface AuthenticatedRequest extends Request {
  user?: payloadJWT
}

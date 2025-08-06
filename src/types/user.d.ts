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

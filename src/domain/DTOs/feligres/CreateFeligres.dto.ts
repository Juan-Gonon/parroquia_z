/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { validationMessages } from '../../../constants/validationMessage.c'

export interface CreateFeligresDtoBody {
  nombre: string
  apellido: string
  telefono?: string
  email?: string
}

export class CreateFeligresDto {
  private constructor (
    public readonly nombre: string,
    public readonly apellido: string,
    public readonly telefono?: string,
    public readonly email?: string
  ) {}

  static create (object: CreateFeligresDtoBody): [string?, CreateFeligresDto?] {
    const { nombre, apellido, telefono, email } = object

    if (!nombre) return [`${validationMessages.required('nombre')}`]
    if (!apellido) return [`${validationMessages.required('apellido')}`]

    return [undefined!, new CreateFeligresDto(nombre, apellido, telefono, email)]
  }
}

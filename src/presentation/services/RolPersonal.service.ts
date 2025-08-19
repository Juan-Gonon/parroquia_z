/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { prisma } from '../../data/postgress'
import { CustomError, PaginationDto } from '../../domain'
import { CreateRolPersonalDto } from '../../domain/DTOs/RolPersonal/CreateRolPersonal.dto'
import { UpdateRolPersonalDto } from '../../domain/DTOs/RolPersonal/updateRolPersonal.dto'

export class RolPersonalService {
  // Obtener un RolPersonal por su nombre
  public async getRolPersonalByName (nombre: string): Promise<any | null> {
    const rol = await prisma.rolpersonal.findFirst({
      where: { nombre }
    })
    return rol
  }

  // Obtener un RolPersonal por su ID
  public async getRolById (id: number): Promise<any> {
    const rol = await prisma.rolpersonal.findUnique({
      where: { id_rol: id }
    })
    if (rol == null) {
      throw CustomError.badRequest('The requested RolPersonal was not found.')
    }
    return rol
  }

  // Obtener todos los roles de personal con paginación
  public async getAllRoles (
    paginationDto: PaginationDto
  ): Promise<any> {
    const { page, limit } = paginationDto

    try {
      const [total, roles] = await prisma.$transaction([
        prisma.rolpersonal.count(),
        prisma.rolpersonal.findMany({
          skip: (page - 1) * limit,
          take: limit
        })
      ])

      return {
        page,
        limit,
        total,
        next: (page * limit) < total ? `/api/personal-role?page=${page + 1}&limit=${limit}` : null,
        prev: (page - 1 > 0) ? `/api/personal-role?page=${page - 1}&limit=${limit}` : null,
        data: roles
      }
    } catch (error) {
      throw CustomError.internalServer('An error occurred while retrieving the data.')
    }
  }

  // Crear un nuevo RolPersonal
  public async createRol (
    createRolDto: CreateRolPersonalDto
  ): Promise<any> {
    const rolExists = await this.getRolPersonalByName(createRolDto.nombre)
    if (rolExists) {
      throw CustomError.badRequest('A RolPersonal with that name already exists.')
    }
    try {
      const newRol = await prisma.rolpersonal.create({
        data: {
          nombre: createRolDto.nombre,
          descripcion: createRolDto.descripcion ?? null,
          permisos: createRolDto.permisos ?? null
        }
      })
      return newRol
    } catch (error) {
      throw CustomError.internalServer('An error occurred while creating the RolPersonal.')
    }
  }

  // Actualizar un RolPersonal
  public async updateRol (
    updateRolDto: UpdateRolPersonalDto
  ): Promise<any> {
    const rolExists = await this.getRolById(updateRolDto.id)
    if (!rolExists) {
      throw CustomError.badRequest('The requested RolPersonal to update was not found.')
    }

    try {
      const updatedRol = await prisma.rolpersonal.update({
        where: { id_rol: updateRolDto.id },
        data: { ...updateRolDto.values }
      })
      return updatedRol
    } catch (error) {
      throw CustomError.internalServer('An error occurred while updating the RolPersonal.')
    }
  }

  // Eliminar un RolPersonal
  public async deleteRol (id: number): Promise<any> {
    const rolExists = await this.getRolById(id)
    if (!rolExists) {
      throw CustomError.badRequest('The requested RolPersonal to delete was not found.')
    }
    try {
      await prisma.rolpersonal.delete({
        where: { id_rol: id }
      })
      return { message: 'RolPersonal successfully deleted' }
    } catch (error) {
      throw CustomError.internalServer('An error occurred while deleting the RolPersonal.')
    }
  }
}

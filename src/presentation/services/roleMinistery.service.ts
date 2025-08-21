/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { prisma } from '../../data/postgress'
import { CustomError, PaginationDto } from '../../domain'
import { CreateRolDentroMinisterioDto } from '../../domain/DTOs/roleMinistery/CreateRoleMinistry.dto'
import { UpdateRolDentroMinisterioDto } from '../../domain/DTOs/roleMinistery/UpdateRoleMinistry.dto'

export class RolDentroMinisterioService {
  // Obtener un RolDentroMinisterio por su nombre
  public async getRolDentroMinisterioByName (nombre: string): Promise<any | null> {
    const rol = await prisma.roldentroministerio.findFirst({
      where: { nombre }
    })
    return rol
  }

  // Obtener un RolDentroMinisterio por su ID
  public async getRolById (id: number): Promise<any> {
    const rol = await prisma.roldentroministerio.findUnique({
      where: { id_roldentroministerio: id }
    })
    if (rol == null) {
      throw CustomError.badRequest('The requested RolDentroMinisterio was not found.')
    }
    return rol
  }

  // Obtener todos los roles de dentro de ministerio con paginación
  public async getAllRoles (
    paginationDto: PaginationDto
  ): Promise<any> {
    const { page, limit } = paginationDto

    try {
      const [total, roles] = await prisma.$transaction([
        prisma.roldentroministerio.count(),
        prisma.roldentroministerio.findMany({
          skip: (page - 1) * limit,
          take: limit
        })
      ])

      return {
        page,
        limit,
        total,
        next: (page * limit) < total ? `/api/role-d-ministry?page=${page + 1}&limit=${limit}` : null,
        prev: (page - 1 > 0) ? `/api/role-d-ministry?page=${page - 1}&limit=${limit}` : null,
        data: roles
      }
    } catch (error) {
      throw CustomError.internalServer('An error occurred while retrieving the data.')
    }
  }

  // Crear un nuevo RolDentroMinisterio
  public async createRol (
    createRolDto: CreateRolDentroMinisterioDto
  ): Promise<any> {
    const rolExists = await this.getRolDentroMinisterioByName(createRolDto.nombre)
    if (rolExists) {
      throw CustomError.badRequest('A RolDentroMinisterio with that name already exists.')
    }
    try {
      const newRol = await prisma.roldentroministerio.create({
        data: {
          nombre: createRolDto.nombre,
          descripcion: createRolDto.descripcion ?? null
        }
      })
      return newRol
    } catch (error) {
      throw CustomError.internalServer('An error occurred while creating the RolDentroMinisterio.')
    }
  }

  // Actualizar un RolDentroMinisterio
  public async updateRol (
    updateRolDto: UpdateRolDentroMinisterioDto
  ): Promise<any> {
    const rolExists = await this.getRolById(updateRolDto.id)
    if (!rolExists) {
      throw CustomError.badRequest('The requested RolDentroMinisterio to update was not found.')
    }

    try {
      const updatedRol = await prisma.roldentroministerio.update({
        where: { id_roldentroministerio: updateRolDto.id },
        data: { ...updateRolDto.values }
      })
      return updatedRol
    } catch (error) {
      throw CustomError.internalServer('An error occurred while updating the RolDentroMinisterio.')
    }
  }

  // Eliminar un RolDentroMinisterio
  public async deleteRol (id: number): Promise<any> {
    const rolExists = await this.getRolById(id)
    if (!rolExists) {
      throw CustomError.badRequest('The requested RolDentroMinisterio to delete was not found.')
    }
    try {
      await prisma.roldentroministerio.delete({
        where: { id_roldentroministerio: id }
      })
      return { message: 'RolDentroMinisterio successfully deleted' }
    } catch (error) {
      throw CustomError.internalServer('An error occurred while deleting the RolDentroMinisterio.')
    }
  }
}

/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { prisma } from '../../data/postgress'
import { CustomError, PaginationDto } from '../../domain'
import { CreateGrupoServicioDto } from '../../domain/DTOs/serviceGroup/CreateServiceGroup.dto'
import { UpdateGrupoServicioDto } from '../../domain/DTOs/serviceGroup/UpdateServiceGroup.dto'

// Clase de servicio para la lógica de negocio de GrupoServicio
export class GrupoServicioService {
  // Obtener un registro de grupo por su nombre
  public async getGroupByName (name: string): Promise<any | null> {
    const group = await prisma.gruposervicio.findUnique({
      where: { nombre: name }
    })
    return group
  }

  // Obtener un registro de grupo por su ID
  public async getGroupById (id: number): Promise<any> {
    const group = await prisma.gruposervicio.findUnique({
      where: { id_grupo: id }
    })
    if (group == null) {
      throw CustomError.badRequest('The requested GrupoServicio was not found.')
    }
    return group
  }

  // Obtener todos los grupos de servicio con paginación
  public async getAllGroups (
    paginationDto: PaginationDto
  ): Promise<any> {
    const { page, limit } = paginationDto

    try {
      const [total, groups] = await prisma.$transaction([
        prisma.gruposervicio.count(),
        prisma.gruposervicio.findMany({
          skip: (page - 1) * limit,
          take: limit
        })
      ])

      return {
        page,
        limit,
        total,
        next: (page * limit) < total ? `/api/service-group?page=${page + 1}&limit=${limit}` : null,
        prev: (page - 1 > 0) ? `/api/service-group?page=${page - 1}&limit=${limit}` : null,
        data: groups
      }
    } catch (error) {
      if (error instanceof CustomError) throw error
      throw CustomError.internalServer('An error occurred while retrieving the data.')
    }
  }

  // Crear un nuevo grupo de servicio
  public async createGroup (
    createGrupoServicioDto: CreateGrupoServicioDto
  ): Promise<any> {
    const groupExists = await this.getGroupByName(createGrupoServicioDto.nombre)
    if (groupExists) {
      throw CustomError.badRequest('A GrupoServicio with that name already exists.')
    }

    try {
      const newGroup = await prisma.gruposervicio.create({
        data: {
          nombre: createGrupoServicioDto.nombre,
          descripcion: createGrupoServicioDto.descripcion ?? null,
          activo: createGrupoServicioDto.activo ?? true,
          id_ministerio: createGrupoServicioDto.idMinisterio
        }
      })
      return newGroup
    } catch (error) {
      if (error instanceof CustomError) throw error
      throw CustomError.internalServer('An error occurred while creating the GrupoServicio.')
    }
  }

  // Actualizar un grupo de servicio
  public async updateGroup (
    updateGrupoServicioDto: UpdateGrupoServicioDto
  ): Promise<any> {
    const groupExists = await this.getGroupById(updateGrupoServicioDto.id)

    if (!groupExists) {
      throw CustomError.badRequest('The requested GrupoServicio to update was not found.')
    }

    // Validar nombre único
    if (updateGrupoServicioDto.nombre) {
      const groupNameExists = await this.getGroupByName(updateGrupoServicioDto.nombre)
      if (groupNameExists && groupNameExists.id_grupo !== updateGrupoServicioDto.id) {
        throw CustomError.badRequest('A GrupoServicio with that name already exists.')
      }
    }

    try {
      const updatedGroup = await prisma.gruposervicio.update({
        where: { id_grupo: updateGrupoServicioDto.id },
        data: updateGrupoServicioDto.values
      })
      return updatedGroup
    } catch (error) {
      if (error instanceof CustomError) throw error
      throw CustomError.internalServer('An error occurred while updating the GrupoServicio.')
    }
  }

  // Eliminar un grupo de servicio
  public async deleteGroup (id: number): Promise<any> {
    const groupExists = await this.getGroupById(id)
    if (!groupExists) {
      throw CustomError.badRequest('The requested GrupoServicio to delete was not found.')
    }
    try {
      await prisma.gruposervicio.delete({
        where: { id_grupo: id }
      })
      return { message: 'GrupoServicio successfully deleted' }
    } catch (error) {
      if (error instanceof CustomError) throw error
      throw CustomError.internalServer('An error occurred while deleting the GrupoServicio.')
    }
  }
}

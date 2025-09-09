/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { prisma } from '../../data/postgress'
import { CustomError, PaginationDto } from '../../domain'
import { CreateMiembroGrupoDto } from '../../domain/DTOs/groupMember/CreateGroupMember.dto'
import { UpdateMiembroGrupoDto } from '../../domain/DTOs/groupMember/UpdateGroupMember.dto'

export class MiembroGrupoService {
  // Obtiene un miembro de grupo por su ID
  public async getMiembroById (id: number): Promise<any> {
    try {
      const miembro = await prisma.miembrogrupo.findUnique({
        where: { id_miembrogrupo: id }
      })
      if (!miembro) {
        throw CustomError.badRequest('The requested member was not found.')
      }
      return miembro
    } catch (error) {
      throw CustomError.internalServer('An error occurred while retrieving the member.')
    }
  }

  // Obtiene todos los miembros de grupo
  public async getAllMiembros (pagination: PaginationDto) {
    const { page, limit } = pagination
    try {
      const [total, miembros] = await prisma.$transaction([
        prisma.miembrogrupo.count(),
        prisma.miembrogrupo.findMany({
          skip: (page - 1) * limit,
          take: limit
        })
      ])
      return {
        total,
        page,
        limit,
        next: (page * limit) < total ? `/api/group-member?page=${page + 1}&limit=${limit}` : null,
        prev: (page - 1 > 0) ? `/api/ministry?group-member=${page - 1}&limit=${limit}` : null,
        data: miembros
      }
    } catch (error) {
      throw CustomError.internalServer('An error occurred while retrieving the members.')
    }
  }

  // Crea un nuevo miembro de grupo
  public async createMiembro (createDto: CreateMiembroGrupoDto): Promise<any> {
    const { idPartMin, idGrupoServicio, fechaIni, roldentrogrupo, fechaFin, activo } = createDto
    try {
      // Validar que las entidades relacionadas existan
      const partMinExist = await prisma.participacionministerio.findUnique({
        where: { id_part_min: idPartMin }
      })
      if (!partMinExist) {
        throw CustomError.badRequest('The specified participation does not exist.')
      }

      const grupoServicioExist = await prisma.gruposervicio.findUnique({
        where: { id_grupo: idGrupoServicio }
      })
      if (!grupoServicioExist) {
        throw CustomError.badRequest('The specified service group does not exist.')
      }

      const newMiembro = await prisma.miembrogrupo.create({
        data: {
          id_part_min: idPartMin,
          id_gruposervicio: idGrupoServicio,
          fecha_ini_msia: fechaIni,
          fecha_fin_msia: fechaFin ?? null,
          roldentrogrupo,
          activo: activo !== undefined ? activo : true
        }
      })
      return newMiembro
    } catch (error) {
      throw CustomError.internalServer('An error occurred while creating the member.')
    }
  }

  // Actualiza un miembro de grupo existente
  public async updateMiembro (updateDto: UpdateMiembroGrupoDto): Promise<any> {
    const { id } = updateDto
    try {
      const miembroExist = await prisma.miembrogrupo.findUnique({
        where: { id_miembrogrupo: id }
      })
      if (!miembroExist) {
        throw CustomError.badRequest('The requested member to update was not found.')
      }

      // Validar que las entidades relacionadas existan si se van a actualizar
      if (updateDto.idPartMin) {
        const partMinExist = await prisma.participacionministerio.findUnique({
          where: { id_part_min: updateDto.idPartMin }
        })
        if (!partMinExist) {
          throw CustomError.badRequest('The specified participation does not exist.')
        }
      }
      if (updateDto.idGrupoServicio) {
        const grupoServicioExist = await prisma.gruposervicio.findUnique({
          where: { id_grupo: updateDto.idGrupoServicio }
        })
        if (!grupoServicioExist) {
          throw CustomError.badRequest('The specified service group does not exist.')
        }
      }

      // Validar las fechas
      const fechaIniP = updateDto.fechaIni ? updateDto.fechaIni : miembroExist.fecha_ini_msia
      const fechaFinP = updateDto.fechaFin ? updateDto.fechaFin : null
      if (fechaFinP !== null && fechaIniP > fechaFinP) {
        throw CustomError.badRequest('fechaIni cannot be after fechaFin')
      }

      const updatedMiembro = await prisma.miembrogrupo.update({
        where: { id_miembrogrupo: id },
        data: updateDto.values
      })
      return updatedMiembro
    } catch (error) {
      console.log(error)
      throw CustomError.internalServer('An error occurred while updating the member.')
    }
  }

  // Elimina un miembro de grupo por su ID
  public async deleteMiembro (id: number) {
    try {
      const miembroExist = await prisma.miembrogrupo.findUnique({
        where: { id_miembrogrupo: id }
      })
      if (!miembroExist) {
        throw CustomError.badRequest('The requested member to delete was not found.')
      }

      await prisma.miembrogrupo.delete({
        where: { id_miembrogrupo: id }
      })
      return { message: 'Member successfully deleted.' }
    } catch (error) {
      throw CustomError.internalServer('An error occurred while deleting the member.')
    }
  }
}

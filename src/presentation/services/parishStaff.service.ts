/* eslint-disable @typescript-eslint/space-before-function-paren */
/* eslint-disable @typescript-eslint/comma-dangle */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { prisma } from '../../data/postgress'
import { CustomError, PaginationDto } from '../../domain'
import { CreatePersonalParroquialDto } from '../../domain/DTOs/parishStaff/CreateParishStaff.dto'
import { UpdatePersonalParroquialDto } from '../../domain/DTOs/parishStaff/UpdateParishStaff.dto'

export class PersonalParroquialService {
  // Obtener un registro de personal por su email
  public async getPersonalByEmail(email: string): Promise<any | null> {
    const personal = await prisma.personalparroquial.findUnique({
      where: { email },
    })
    return personal
  }

  // Obtener un registro de personal por su ID
  public async getPersonalById(id: number): Promise<any> {
    const personal = await prisma.personalparroquial.findUnique({
      where: { id_personal: id },
      include: {
        personal_rol: {
          select: {
            id_rol: true,
          },
        },
      },
    })
    if (personal == null) {
      throw CustomError.badRequest(
        'The requested PersonalParroquial was not found.'
      )
    }
    return personal
  }

  // Obtener todo el personal parroquial con paginación
  public async getAllPersonal(paginationDto: PaginationDto): Promise<any> {
    const { page, limit } = paginationDto

    try {
      const [total, personal] = await prisma.$transaction([
        prisma.personalparroquial.count(),
        prisma.personalparroquial.findMany({
          skip: (page - 1) * limit,
          take: limit,
          include: {
            personal_rol: {
              include: {
                rolpersonal: {
                  select: {
                    nombre: true,
                    descripcion: true,
                  },
                },
              },
            },
          },
        }),
      ])

      return {
        page,
        limit,
        total,
        next:
          page * limit < total
            ? `/api/parish-staff?page=${page + 1}&limit=${limit}`
            : null,
        prev:
          page - 1 > 0
            ? `/api/parish-staff?page=${page - 1}&limit=${limit}`
            : null,
        data: personal,
      }
    } catch (error) {
      throw CustomError.internalServer(
        'An error occurred while retrieving the data.'
      )
    }
  }

  // Crear un nuevo registro de personal parroquial
  public async createPersonal(
    createPersonalDto: CreatePersonalParroquialDto
  ): Promise<any> {
    if (createPersonalDto.email) {
      const personalExists = await this.getPersonalByEmail(
        createPersonalDto.email
      )
      if (personalExists) {
        throw CustomError.badRequest(
          'A PersonalParroquial with that email already exists.'
        )
      }
    }

    try {
      const newPersonal = await prisma.personalparroquial.create({
        data: {
          nombre: createPersonalDto.nombre,
          apellido: createPersonalDto.apellido,
          direccion: createPersonalDto.direccion ?? null,
          email: createPersonalDto.email ?? null,
          telefono: createPersonalDto.telefono ?? null,
        },
      })

      if (!newPersonal) throw CustomError.badRequest('Error register personal')

      const rol = await prisma.personal_rol.create({
        data: {
          id_personal: newPersonal.id_personal,
          id_rol: createPersonalDto.idRol,
        },
      })

      return {
        ...newPersonal,
        id_rol: rol.id_rol,
      }
    } catch (error) {
      throw CustomError.internalServer(
        'An error occurred while creating the PersonalParroquial.'
      )
    }
  }

  public async updatePersonal(
    updatePersonalDto: UpdatePersonalParroquialDto
  ): Promise<any> {
    const personalExists = await this.getPersonalById(updatePersonalDto.id)

    if (!personalExists) {
      throw CustomError.badRequest(
        'The requested PersonalParroquial to update was not found.'
      )
    }

    // Validar email único
    if (updatePersonalDto.email) {
      const personalEmailExists = await this.getPersonalByEmail(
        updatePersonalDto.email
      )
      if (
        personalEmailExists &&
        personalEmailExists.id_personal !== updatePersonalDto.id
      ) {
        throw CustomError.badRequest(
          'A PersonalParroquial with that email already exists.'
        )
      }
    }

    try {
      const { id_rol: idRol, ...valuesUpdated } = updatePersonalDto.values

      const result = await prisma.$transaction(async (tx) => {
        // 🔹 Actualizar datos básicos del personal
        const updatedPersonal = await tx.personalparroquial.update({
          where: { id_personal: updatePersonalDto.id },
          data: { ...valuesUpdated },
        })

        // 🔹 Manejo del rol (solo si viene un idRol en el DTO)
        if (idRol) {
          const currentRoles = personalExists.personal_rol

          if (currentRoles.length > 0) {
            const currentRolId = currentRoles[0].id_rol

            // ⚡ Si es el mismo rol, no hacemos nada
            if (currentRolId !== idRol) {
              await tx.personal_rol.update({
                where: {
                  id_personal_id_rol: {
                    id_personal: updatedPersonal.id_personal,
                    id_rol: currentRolId,
                  },
                },
                data: { id_rol: idRol },
              })
            }
          } else {
            // Si no tenía rol, lo creamos
            await tx.personal_rol.create({
              data: {
                id_personal: updatedPersonal.id_personal,
                id_rol: idRol,
              },
            })
          }
        }

        return updatedPersonal
      })

      return result
    } catch (error) {
      throw CustomError.internalServer(
        'An error occurred while updating the PersonalParroquial.'
      )
    }
  }

  // Eliminar un registro de personal parroquial
  public async deletePersonal(id: number): Promise<any> {
    const personalExists = await this.getPersonalById(id)
    if (!personalExists) {
      throw CustomError.badRequest(
        'The requested PersonalParroquial to delete was not found.'
      )
    }
    try {
      await prisma.personalparroquial.delete({
        where: { id_personal: id },
      })
      return { message: 'PersonalParroquial successfully deleted' }
    } catch (error) {
      throw CustomError.internalServer(
        'An error occurred while deleting the PersonalParroquial.'
      )
    }
  }
}

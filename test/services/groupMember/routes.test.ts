/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import request from 'supertest'
import { testServer } from '../../presentation/test-server'
import { prisma } from '../../../src/data/postgress'
// import { PARAMS_BODY } from '../../../src/constants/params.c'

describe('MiembroGrupo route testing', () => {
//   const miembroGrupo = {
//     idPartMin: 1,
//     idGrupoServicio: 1,
//     fechaIni: '2023-01-01',
//     fechaFin: '2023-01-31',
//     roldentrogrupo: 'Líder de Grupo',
//     activo: true
//   }

  let id: number
  let createdPersonalId: number
  let createdMinisterioId: number
  let createdRolId: number
  let participacionId: number

  beforeAll(async () => {
    await testServer.start()

    const personal = await prisma.personalparroquial.create({
      data: {
        nombre: 'Test Personal',
        apellido: 'Test apellido'
      }
    })
    createdPersonalId = personal.id_personal

    const ministerio = await prisma.ministerio.create({
      data: {
        nombre: 'Test Ministerio',
        descripcion: 'Test Description'
      }
    })
    createdMinisterioId = ministerio.id_ministerio

    const rol = await prisma.roldentroministerio.create({
      data: {
        nombre: 'Test Rol',
        descripcion: 'Test Description'
      }
    })
    createdRolId = rol.id_roldentroministerio

    const partMinisterio = await prisma.participacionministerio.create({
      data: {
        id_personal: createdPersonalId,
        id_ministerio: createdMinisterioId,
        id_roldentroministerio: createdRolId,
        fecha_ini_part: new Date('2025-09-02')
      }
    })

    participacionId = partMinisterio.id_part_min
  })

  afterAll(async () => {
    await prisma.participacionministerio.delete({
      where: {
        id_part_min: participacionId
      }
    })

    await prisma.personalparroquial.delete({
      where: { id_personal: createdPersonalId }
    })
    await prisma.ministerio.delete({
      where: { id_ministerio: createdMinisterioId }
    })
    await prisma.roldentroministerio.delete({
      where: { id_roldentroministerio: createdRolId }
    })

    await testServer.close()
  })

  it('should return all MiembroGrupo with pagination when making a GET request to /api/group-member', async () => {
    const { body } = await request(testServer.app).get('/api/group-member').expect(200)
    expect(body.data).toBeInstanceOf(Array)
    //  expect(body.total).toBe(0) // Debe ser 0 antes de crear uno
  })

  it('should create a new MiembroGrupo when making a POST request to /api/group-member', async () => {
    const miembroGrupo = {
      idPartMin: participacionId,
      idGrupoServicio: 5,
      fechaIni: '2023-01-01',
      fechaFin: '2023-01-31',
      roldentrogrupo: 'Líder de Grupo',
      activo: true
    }
    const { body } = await request(testServer.app)
      .post('/api/group-member')
      .send(miembroGrupo)
      .expect(200)

    id = body.id_miembrogrupo

    expect(body).toEqual({
      id_miembrogrupo: expect.any(Number),
      id_part_min: miembroGrupo.idPartMin,
      id_gruposervicio: miembroGrupo.idGrupoServicio,
      fecha_ini_msia: `${miembroGrupo.fechaIni}T00:00:00.000Z`,
      fecha_fin_msia: `${miembroGrupo.fechaFin}T00:00:00.000Z`,
      roldentrogrupo: miembroGrupo.roldentrogrupo,
      activo: miembroGrupo.activo
    })
  })

  it('should return a MiembroGrupo by ID when making a GET request to /api/group-member/:id', async () => {
    const miembroGrupo = {
      idPartMin: participacionId,
      idGrupoServicio: 5,
      fechaIni: '2023-01-01',
      fechaFin: '2023-01-31',
      roldentrogrupo: 'Líder de Grupo',
      activo: true
    }
    const { body } = await request(testServer.app).get(`/api/group-member/${id}`).expect(200)

    expect(body).toEqual({
      id_miembrogrupo: id,
      id_part_min: miembroGrupo.idPartMin,
      id_gruposervicio: miembroGrupo.idGrupoServicio,
      fecha_ini_msia: `${miembroGrupo.fechaIni}T00:00:00.000Z`,
      fecha_fin_msia: `${miembroGrupo.fechaFin}T00:00:00.000Z`,
      roldentrogrupo: miembroGrupo.roldentrogrupo,
      activo: miembroGrupo.activo
    })
  })

  it('should return an error when updating a non-existing MiembroGrupo', async () => {
    const { body } = await request(testServer.app)
      .put('/api/group-member/999')
      .send({ rolDentroGrupo: 'Non-existing' })
      .expect(400)

    expect(body.error).toBe('Nothing to update')
  })

  it('should update a MiembroGrupo when making a PUT request to /api/miembrogrupo/:id', async () => {
    const updatedMiembro = { roldentrogrupo: 'Líder de Grupo (Actualizado)', activo: false }
    const miembroGrupo = {
      idPartMin: participacionId,
      idGrupoServicio: 5,
      fechaIni: '2023-01-01',
      fechaFin: '2023-01-31',
      roldentrogrupo: 'Líder de Grupo',
      activo: true
    }

    const { body } = await request(testServer.app)
      .put(`/api/group-member/${id}`)
      .send(updatedMiembro)
      .expect(200)

    expect(body).toEqual({
      id_miembrogrupo: id,
      id_part_min: miembroGrupo.idPartMin,
      id_gruposervicio: miembroGrupo.idGrupoServicio,
      fecha_ini_msia: `${miembroGrupo.fechaIni}T00:00:00.000Z`,
      fecha_fin_msia: `${miembroGrupo.fechaFin}T00:00:00.000Z`,
      roldentrogrupo: updatedMiembro.roldentrogrupo,
      activo: updatedMiembro.activo
    })
  })

  it('should delete a MiembroGrupo when making a DELETE request to /api/group-member/:id', async () => {
    const { body } = await request(testServer.app).delete(`/api/group-member/${id}`).expect(200)
    expect(body.message).toBe('Member successfully deleted.')
  })

  it('should return an error when deleting a non-existing MiembroGrupo', async () => {
    const { body } = await request(testServer.app).delete('/api/group-member/999').expect(500)
    expect(body.error).toBe('An error occurred while deleting the member.')
  })
})

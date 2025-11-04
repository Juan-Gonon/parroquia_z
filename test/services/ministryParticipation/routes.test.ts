/* eslint-disable @typescript-eslint/restrict-template-expressions */
// import { prisma } from '../../../src/data/postgress'
import request from 'supertest'
import { testServer } from '../../presentation/test-server'
import { prisma } from '../../../src/data/postgress'

describe('ParticipacionMinisterio route testing', () => {
  let createdPersonalId: number
  let createdMinisterioId: number
  let createdRolId: number
  let participacionId: number

  beforeAll(async () => {
    await testServer.start()
    // Create necessary related records for testing
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
  })

  afterAll(async () => {
    await prisma.participacionministerio.deleteMany({
      where: {
        id_personal: createdPersonalId,
        id_ministerio: createdMinisterioId
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
    testServer.close()
  })

  // Test suite for GET all participations
  it('should return a list of participations when calling GET /api/ministy-participation', async () => {
    const { body } = await request(testServer.app)
      .get('/api/ministy-participation')
      .expect(200)

    expect(body.data).toBeInstanceOf(Array)
  })

  // Test suite for POST (create) participation
  it('should create a new participation when posting valid data to /api/ministy-participation', async () => {
    const testParticipation = {
      idPersonal: createdPersonalId,
      idMinisterio: createdMinisterioId,
      idRol: createdRolId,
      fechaIni: '2023-01-01'
    }

    const { body } = await request(testServer.app)
      .post('/api/ministy-participation')
      .send(testParticipation)
      .expect(200)

    participacionId = body.id_part_min

    expect(body).toEqual({
      id_part_min: expect.any(Number),
      id_personal: testParticipation.idPersonal,
      id_ministerio: testParticipation.idMinisterio,
      id_roldentroministerio: testParticipation.idRol,
      fecha_ini_part: expect.any(String),
      fecha_fin_part: null,
      activo: true
    })
  })

  // Test suite for GET by ID
  it('should return a participation when requesting /api/ministy-participation/:id', async () => {
    const { body } = await request(testServer.app)
      .get(`/api/ministy-participation/${participacionId}`)
      .expect(200)

    expect(body).toEqual({
      id_part_min: participacionId,
      id_personal: createdPersonalId,
      id_ministerio: createdMinisterioId,
      id_roldentroministerio: createdRolId,
      fecha_ini_part: expect.any(String),
      fecha_fin_part: null,
      activo: true
    })
  })

  // Test suite for PUT (update)
  it('should update a participation when calling PUT on /api/ministy-participation/:id with valid data', async () => {
    const updateData = {
      activo: false,
      fechaFin: '2023-12-31'
    }

    const { body } = await request(testServer.app)
      .put(`/api/ministy-participation/${participacionId}`)
      .send(updateData)
      .expect(200)

    expect(body).toEqual({
      id_part_min: participacionId,
      id_personal: createdPersonalId,
      id_ministerio: createdMinisterioId,
      id_roldentroministerio: createdRolId,
      fecha_ini_part: expect.any(String),
      fecha_fin_part: expect.any(String),
      activo: false
    })
  })

  // Test suite for DELETE
  it('should delete a participation when calling DELETE on /api/ministy-participation/:id', async () => {
    const { body } = await request(testServer.app)
      .delete(`/api/ministy-participation/${participacionId}`)
      .expect(200)

    expect(body.message).toBe('Participation successfully deleted')

    // Verify deletion by attempting to get the record
    await request(testServer.app)
      .get(`/api/ministy-participation/${participacionId}`)
      .expect(400)
  })
})

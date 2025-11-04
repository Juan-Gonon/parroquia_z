/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import request from 'supertest'
import { testServer } from '../../presentation/test-server'
import { prisma } from '../../../src/data/postgress'

describe('LiderComunitario route testing', () => {
  let liderComunitarioId: number
  let createdPersonalId: number
  let createdComunidadId: number
  const API_URL = '/api/comunity-leader'

  beforeAll(async () => {
    await testServer.start()

    const personal = await prisma.personalparroquial.create({
      data: {
        nombre: 'Test Personal',
        apellido: 'Test Apellido'
      }
    })
    createdPersonalId = personal.id_personal

    const comunidad = await prisma.comunidad.create({
      data: {
        nombre: 'Test Comunidad',
        direccion: 'Calle Test 123',
        id_parroquia: 1
      }
    })
    createdComunidadId = comunidad.id_comunidad
  })

  afterAll(async () => {
    await prisma.lidercomunitario.deleteMany({
      where: {
        id_personal: createdPersonalId,
        id_comunidad: createdComunidadId
      }
    })
    await prisma.personalparroquial.delete({
      where: { id_personal: createdPersonalId }
    })
    await prisma.comunidad.delete({
      where: { id_comunidad: createdComunidadId }
    })

    await testServer.close()
  })

  it('should return all Lideres Comunitarios with pagination when making a GET request to /api/comunity-leader', async () => {
    const { body } = await request(testServer.app).get(API_URL).expect(200)
    expect(body.data).toBeInstanceOf(Array)
    //  expect(body.total).toBe(0)
  })

  it('should create a new Lider Comunitario when making a POST request to /api/comunity-leader', async () => {
    const lider = {
      idPersonal: createdPersonalId,
      idComunidad: createdComunidadId,
      rolliderazgo: 'Líder General',
      fechaIni: '2023-01-01',
      activo: true
    }
    const { body } = await request(testServer.app)
      .post(API_URL)
      .send(lider)
      .expect(201)

    liderComunitarioId = body.id_lider

    expect(body).toEqual({
      id_lider: expect.any(Number),
      id_personal: lider.idPersonal,
      id_comunidad: lider.idComunidad,
      rolliderazgo: lider.rolliderazgo,
      fecha_ini: `${lider.fechaIni}T00:00:00.000Z`,
      fecha_fin: null,
      activo: lider.activo
    })
  })

  it('should return a Lider Comunitario by ID when making a GET request to /api/comunity-leader/:id', async () => {
    const { body } = await request(testServer.app).get(`${API_URL}/${liderComunitarioId}`).expect(200)

    expect(body).toEqual({
      id_lider: liderComunitarioId,
      id_personal: createdPersonalId,
      id_comunidad: createdComunidadId,
      rolliderazgo: 'Líder General',
      fecha_ini: '2023-01-01T00:00:00.000Z',
      fecha_fin: null,
      activo: true
    })
  })

  it('should update a Lider Comunitario when making a PUT request to /api/comunity-leader/:id', async () => {
    const updatedLider = { rolliderazgo: 'Líder Actualizado', activo: false, fechaFin: '2023-12-31' }
    const { body } = await request(testServer.app)
      .put(`${API_URL}/${liderComunitarioId}`)
      .send(updatedLider)
      .expect(200)

    expect(body).toEqual({
      id_lider: liderComunitarioId,
      id_personal: createdPersonalId,
      id_comunidad: createdComunidadId,
      rolliderazgo: updatedLider.rolliderazgo,
      fecha_ini: '2023-01-01T00:00:00.000Z',
      fecha_fin: `${updatedLider.fechaFin}T00:00:00.000Z`,
      activo: updatedLider.activo
    })
  })

  it('should return an error when updating a non-existing Lider Comunitario', async () => {
    const { body } = await request(testServer.app)
      .put(`${API_URL}/999`)
      .send({ rolliderazgo: 'Non-existing' })
      .expect(400)

    expect(body.error).toBe('The requested leader was not found.')
  })

  it('should delete a Lider Comunitario when making a DELETE request to /api/comunity-leader/:id', async () => {
    const { body } = await request(testServer.app).delete(`${API_URL}/${liderComunitarioId}`).expect(200)

    expect(body.message).toBe('Community leader successfully deleted.')
  })

  it('should return an error when deleting a non-existing Lider Comunitario', async () => {
    const { body } = await request(testServer.app).delete(`${API_URL}/999`).expect(400)
    expect(body.error).toBe('The requested leader was not found.')
  })
})

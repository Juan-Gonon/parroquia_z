/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import request from 'supertest'
import { testServer } from '../../presentation/test-server'
import { prisma } from '../../../src/data/postgress'

describe('Feligres route testing', () => {
  let createdFeligresId: number

  beforeAll(async () => {
    await testServer.start()
  })

  afterAll(async () => {
    await prisma.feligres.deleteMany({})
    await testServer.close()
  })

  it('should create a new feligres when making a POST request to /api/feligreses', async () => {
    const feligresData = {
      nombre: 'John',
      apellido: 'Doe',
      telefono: '12345678',
      email: 'john.doe@example.com'
    }

    const { body } = await request(testServer.app)
      .post('/api/feligreses')
      .send(feligresData)
      .expect(200)

    createdFeligresId = body.id_feligres

    expect(body).toEqual({
      id_feligres: expect.any(Number),
      nombre: feligresData.nombre,
      apellido: feligresData.apellido,
      fecharegistro: expect.any(String),
      telefono: feligresData.telefono,
      email: feligresData.email
    })
  })

  it('should return an error when creating a feligres with a repeated email', async () => {
    const feligresData = {
      nombre: 'Jane',
      apellido: 'Doe',
      email: 'john.doe@example.com'
    }

    const { body } = await request(testServer.app)
      .post('/api/feligreses')
      .send(feligresData)
      .expect(400)

    expect(body.error).toBe('The email already exists')
  })

  it('should return a feligres by ID when making a GET request to /api/feligreses/:id', async () => {
    const { body } = await request(testServer.app).get(`/api/feligreses/${createdFeligresId}`).expect(200)

    expect(body).toEqual({
      id_feligres: expect.any(Number),
      nombre: 'John',
      apellido: 'Doe',
      fecharegistro: expect.any(String),
      telefono: '12345678',
      email: 'john.doe@example.com'
    })
  })

  it('should return an error when getting a non-existing feligres', async () => {
    const { body } = await request(testServer.app).get('/api/feligreses/999').expect(400)

    expect(body.error).toBe('The specified feligres does not exist')
  })

  it('should update a feligres when making a PUT request to /api/feligreses/:id', async () => {
    const updatedData = { telefono: '98765432' }
    const { body } = await request(testServer.app)
      .put(`/api/feligreses/${createdFeligresId}`)
      .send(updatedData)
      .expect(200)

    expect(body).toEqual({
      id_feligres: createdFeligresId,
      nombre: 'John',
      apellido: 'Doe',
      fecharegistro: expect.any(String),
      telefono: updatedData.telefono,
      email: 'john.doe@example.com'
    })
  })

  it('should return an error when updating a non-existing feligres', async () => {
    const { body } = await request(testServer.app)
      .put('/api/feligreses/999')
      .send({ nombre: 'Non-existing' })
      .expect(400)

    expect(body.error).toBe('The specified feligres does not exist')
  })

  it('should delete a feligres when making a DELETE request to /api/feligreses/:id', async () => {
    const { body } = await request(testServer.app).delete(`/api/feligreses/${createdFeligresId}`).expect(200)
    expect(body.message).toBe('Feligres deleted successfully')
  })

  it('should return an error when deleting a non-existing feligres', async () => {
    const { body } = await request(testServer.app).delete('/api/feligreses/999').expect(400)
    expect(body.error).toBe('The specified feligres does not exist')
  })
})

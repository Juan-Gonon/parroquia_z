/* eslint-disable @typescript-eslint/restrict-template-expressions */
// import { prisma } from '../../../src/data/postgress'
import request from 'supertest'
import { testServer } from '../../presentation/test-server'

describe('Community route testing', () => {
  beforeAll(async () => {
    await testServer.start()
  })

  afterAll(async () => {
    testServer.close()
  })

  const community = {
    nombre: 'Rosario',
    direccion: 'Colonia el rosario',
    email: 'rosario@gmail.com',
    telefono: '12345678',
    id_parroquia: 1
  }
  let id

  it('should return a Community api/community/', async () => {
    const { body } = await request(testServer.app)
      .get('/api/communities')
      .expect(200)

    expect(body.comunities).toBeInstanceOf(Array)
  })

  it('should create a new community when posting valid data to /api/communities', async () => {
    const { body } = await request(testServer.app)
      .post('/api/communities')
      .send(community)
      .expect(200)

    id = body.id_comunidad

    expect(body).toEqual({
      id_comunidad: expect.any(Number),
      nombre: community.nombre,
      direccion: community.direccion,
      telefono: community.telefono,
      email: community.email,
      id_parroquia: community.id_parroquia
    })
  })

  it('should return a community when requesting /api/communities/:id', async () => {
    const { body } = await request(testServer.app)
      .get(`/api/communities/${id}`)
      .expect(200)

    expect(body).toEqual({
      id_comunidad: expect.any(Number),
      nombre: community.nombre,
      direccion: community.direccion,
      telefono: community.telefono,
      email: community.email,
      id_parroquia: community.id_parroquia
    })
  })

  it('should return error when creating a duplicate community', async () => {
    const { body } = await request(testServer.app)
      .post('/api/communities')
      .send(community)
      .expect(400)

    expect(body.error).toBe('The community already exists')
  })

  it('should return error when getting a non-existing community', async () => {
    const { body } = await request(testServer.app)
      .get('/api/communities/99999')
      .expect(400)

    expect(body.error).toBe('The specified community does not exist')
  })

  it('should delete a Community when calling DELETE on /api/communities/:id', async () => {
    const { body } = await request(testServer.app)
      .delete(`/api/communities/${id}`)
      .expect(200)

    expect(body.success).toBeTruthy()
    expect(body.message).toBe('Community deleted successfully')
  })

  it('should return error when deleting a non-existing community', async () => {
    const { body } = await request(testServer.app)
      .delete('/api/communities/99999')
      .expect(400)

    expect(body.error).toBe('The specified community does not exist')
  })
})

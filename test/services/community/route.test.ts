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

  it('should return a Community api/community/', async () => {
    const { body } = await request(testServer.app)
      .get('/api/communities')
      .expect(200)

    expect(body.comunities).toBeInstanceOf(Array)
  })
})

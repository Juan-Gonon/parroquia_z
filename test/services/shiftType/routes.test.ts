/* eslint-disable @typescript-eslint/restrict-template-expressions */
import request from 'supertest'
import { testServer } from '../../presentation/test-server'

describe('TipoTurno route testing', () => {
  // Objeto de datos de prueba para un tipo de turno
  const tipoTurno = {
    nombre: 'Rezo del Rosario',
    descripcion: 'Rezo en comunidad del Santo Rosario'
  }
  let id: number

  beforeAll(async () => {
    // Inicia el servidor de prueba antes de todas las pruebas
    await testServer.start()
  })

  afterAll(async () => {
    // Cierra el servidor después de todas las pruebas
    testServer.close()
  })

  it('should create a new TipoTurno when posting valid data to /api/tipos-turno', async () => {
    const { body } = await request(testServer.app)
      .post('/api/tipos-turno')
      .send(tipoTurno)
      .expect(200)

    id = +body.id_tipo

    expect(body).toEqual({
      id_tipo: expect.any(Number),
      nombre: tipoTurno.nombre,
      descripcion: tipoTurno.descripcion
    })
  })

  it('should return a TipoTurno when requesting /api/tipos-turno/:id', async () => {
    const { body } = await request(testServer.app)
      .get(`/api/tipos-turno/${id}`)
      .expect(200)

    expect(body).toEqual({
      id_tipo: expect.any(Number),
      nombre: tipoTurno.nombre,
      descripcion: tipoTurno.descripcion
    })
  })

  it('should return a list of TipoTurnos from /api/tipos-turno', async () => {
    const { body } = await request(testServer.app)
      .get('/api/tipos-turno')
      .expect(200)

    expect(body.data).toBeInstanceOf(Array)
  })

  it('should return error when creating a duplicate TipoTurno', async () => {
    const { body } = await request(testServer.app)
      .post('/api/tipos-turno')
      .send(tipoTurno)
      .expect(400)

    expect(body.error).toBe('A Type of Shift with that name already exists.')
  })

  it('should return error when getting a non-existing TipoTurno', async () => {
    const { body } = await request(testServer.app)
      .get('/api/tipos-turno/99999')
      .expect(400)

    expect(body.error).toBe('The requested Type of Shift was not found.')
  })

  it('should return error when updating a non-existing TipoTurno', async () => {
    const { body } = await request(testServer.app)
      .put('/api/tipos-turno/99999')
      .send({ nombre: 'Test' })
      .expect(400)

    expect(body.error).toBe('The requested Type of Shift was not found.')
  })

  it('should update a TipoTurno when calling PUT on /api/tipos-turno/:id', async () => {
    const updatedData = {
      nombre: 'Rezo del Rosario Modificado',
      descripcion: 'Rezo modificado'
    }
    const { body } = await request(testServer.app)
      .put(`/api/tipos-turno/${id}`)
      .send(updatedData)
      .expect(200)

    expect(body).toEqual({
      id_tipo: expect.any(Number),
      nombre: updatedData.nombre,
      descripcion: updatedData.descripcion
    })
  })

  it('should delete a TipoTurno when calling DELETE on /api/tipos-turno/:id', async () => {
    const { body } = await request(testServer.app)
      .delete(`/api/tipos-turno/${id}`)
      .expect(200)

    expect(body.message).toBe('Type of Shift successfully deleted')
  })

  it('should return error when deleting a non-existing TipoTurno', async () => {
    const { body } = await request(testServer.app)
      .delete('/api/tipos-turno/99999')
      .expect(400)

    expect(body.error).toBe('The requested Type of Shift was not found.')
  })
})

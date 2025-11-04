/* eslint-disable @typescript-eslint/restrict-template-expressions */
import request from 'supertest'
import { testServer } from '../../presentation/test-server'

describe('TipoEvento route testing', () => {
  // Objeto de datos de prueba para un tipo de evento
  const tipoEvento = {
    nombre: 'Misa de Sanación',
    descripcion: 'Misa especial por la salud de los enfermos'
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

  it('should create a new TipoEvento when posting valid data to /api/event-type', async () => {
    const { body } = await request(testServer.app)
      .post('/api/event-type')
      .send(tipoEvento)
      .expect(200)

    id = body.id_tipo

    // Se verifica que la respuesta contenga los datos correctos
    expect(body).toEqual({
      id_tipo: expect.any(Number),
      nombre: tipoEvento.nombre,
      descripcion: tipoEvento.descripcion
    })
  })

  it('should return a TipoEvento when requesting /api/event-type/:id', async () => {
    const { body } = await request(testServer.app)
      .get(`/api/event-type/${id}`)
      .expect(200)

    // Se verifica que la respuesta sea el objeto esperado
    expect(body).toEqual({
      id_tipo: expect.any(Number),
      nombre: tipoEvento.nombre,
      descripcion: tipoEvento.descripcion
    })
  })

  it('should return a list of TipoEventos from /api/event-type', async () => {
    const { body } = await request(testServer.app)
      .get('/api/event-type')
      .expect(200)

    // Se verifica que la respuesta contenga un array de datos
    expect(body.data).toBeInstanceOf(Array)
  })

  it('should return error when creating a duplicate TipoEvento', async () => {
    const { body } = await request(testServer.app)
      .post('/api/event-type')
      .send(tipoEvento)
      .expect(400)

    // Se verifica el mensaje de error
    expect(body.error).toBe('A Type of Event with that name already exists.')
  })

  it('should return error when getting a non-existing TipoEvento', async () => {
    const { body } = await request(testServer.app)
      .get('/api/event-type/99999')
      .expect(400)

    // Se verifica el mensaje de error
    expect(body.error).toBe('The requested Type of Event was not found.')
  })

  it('should return error when updating a non-existing TipoEvento', async () => {
    const { body } = await request(testServer.app)
      .put('/api/event-type/99999')
      .send({ nombre: 'Test' })
      .expect(400)

    // Se verifica el mensaje de error
    expect(body.error).toBe('The requested Type of Event was not found.')
  })

  it('should update a TipoEvento when calling PUT on /api/event-type/:id', async () => {
    const updatedData = {
      nombre: 'Misa de Sanación Modificada',
      descripcion: 'Misa modificada por la salud de los enfermos'
    }
    const { body } = await request(testServer.app)
      .put(`/api/event-type/${id}`)
      .send(updatedData)
      .expect(200)

    // Se verifica que la respuesta sea el objeto actualizado
    expect(body).toEqual({
      id_tipo: expect.any(Number),
      nombre: updatedData.nombre,
      descripcion: updatedData.descripcion
    })
  })

  it('should delete a TipoEvento when calling DELETE on /api/event-type/:id', async () => {
    const { body } = await request(testServer.app)
      .delete(`/api/event-type/${id}`)
      .expect(200)

    // Se verifica el mensaje de éxito
    expect(body.message).toBe('Type of Event successfully deleted')
  })

  it('should return error when deleting a non-existing TipoEvento', async () => {
    const { body } = await request(testServer.app)
      .delete('/api/event-type/99999')
      .expect(400)

    // Se verifica el mensaje de error
    expect(body.error).toBe('The requested Type of Event was not found.')
  })
})

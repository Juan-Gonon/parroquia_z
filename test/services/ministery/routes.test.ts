/* eslint-disable @typescript-eslint/restrict-template-expressions */
import request from 'supertest'
import { testServer } from '../../presentation/test-server'

describe('Ministerio route testing', () => {
  // Objeto de datos de prueba para un ministerio
  const ministerio = {
    nombre: 'Ministerio de Música',
    descripcion: 'Ministerio encargado del servicio de la alabanza',
    fechafundacion: '2023-01-15T00:00:00.000Z'
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

  it('should create a new Ministerio when posting valid data to /api/ministry', async () => {
    // Prueba para la creación exitosa de un ministerio
    const { body } = await request(testServer.app)
      .post('/api/ministry')
      .send(ministerio)
      .expect(200)

    id = body.id_ministerio

    // Se verifica que la respuesta contenga los datos correctos
    expect(body).toEqual({
      id_ministerio: expect.any(Number),
      nombre: ministerio.nombre,
      descripcion: ministerio.descripcion,
      fechafundacion: ministerio.fechafundacion
    })
  })

  it('should return a Ministerio when requesting /api/ministry/:id', async () => {
    // Prueba para obtener un ministerio por su ID
    const { body } = await request(testServer.app)
      .get(`/api/ministry/${id}`)
      .expect(200)

    // Se verifica que la respuesta sea el objeto esperado
    expect(body).toEqual({
      id_ministerio: expect.any(Number),
      nombre: ministerio.nombre,
      descripcion: ministerio.descripcion,
      fechafundacion: ministerio.fechafundacion
    })
  })

  it('should return a list of ministry from /api/ministry', async () => {
    // Prueba para obtener todos los ministry
    const { body } = await request(testServer.app)
      .get('/api/ministry')
      .expect(200)

    // Se verifica que la respuesta contenga un array de datos
    expect(body.data).toBeInstanceOf(Array)
  })

  it('should return error when creating a duplicate Ministerio', async () => {
    // Prueba para un caso de fallo: crear un ministerio duplicado
    const { body } = await request(testServer.app)
      .post('/api/ministry')
      .send(ministerio)
      .expect(400)

    // Se verifica el mensaje de error
    expect(body.error).toBe('A Ministry with that name already exists.')
  })

  it('should return error when getting a non-existing Ministerio', async () => {
    // Prueba para un caso de fallo: obtener un ID que no existe
    const { body } = await request(testServer.app)
      .get('/api/ministry/99999')
      .expect(400)

    // Se verifica el mensaje de error
    expect(body.error).toBe('The requested Ministry was not found.')
  })

  it('should return error when updating a non-existing Ministerio', async () => {
    // Prueba para un caso de fallo: actualizar un ID que no existe
    const { body } = await request(testServer.app)
      .put('/api/ministry/99999')
      .send({ nombre: 'Test' })
      .expect(400)

    // Se verifica el mensaje de error
    expect(body.error).toBe('The requested Ministry was not found.')
  })

  it('should update a Ministerio when calling PUT on /api/ministry/:id', async () => {
    // Prueba para la actualización de un ministerio
    const updatedData = {
      nombre: 'Ministerio de Música y Alabanza',
      descripcion: 'Ministerio encargado del servicio de la alabanza y adoración',
      fechafundacion: '2023-02-20T00:00:00.000Z'
    }
    const { body } = await request(testServer.app)
      .put(`/api/ministry/${id}`)
      .send(updatedData)
      .expect(200)

    // Se verifica que la respuesta sea el objeto actualizado
    expect(body).toEqual({
      id_ministerio: expect.any(Number),
      nombre: updatedData.nombre,
      descripcion: updatedData.descripcion,
      fechafundacion: updatedData.fechafundacion
    })
  })

  it('should delete a Ministerio when calling DELETE on /api/ministry/:id', async () => {
    // Prueba para la eliminación exitosa de un ministerio
    const { body } = await request(testServer.app)
      .delete(`/api/ministry/${id}`)
      .expect(200)

    // Se verifica el mensaje de éxito
    expect(body.message).toBe('Ministry successfully deleted')
  })

  it('should return error when deleting a non-existing Ministerio', async () => {
    // Prueba para un caso de fallo: eliminar un ID que no existe
    const { body } = await request(testServer.app)
      .delete('/api/ministry/99999')
      .expect(400)

    // Se verifica el mensaje de error
    expect(body.error).toBe('The requested Ministry was not found.')
  })
})

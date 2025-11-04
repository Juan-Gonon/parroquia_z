/* eslint-disable @typescript-eslint/restrict-template-expressions */
import request from 'supertest'
import { testServer } from '../../presentation/test-server'

describe('TipoIntencion route testing', () => {
  // Objeto de datos de prueba para un tipo de intención
  const tipoIntencion = {
    nombre: 'Acción de gracias',
    descripcion: 'Intención para dar gracias a Dios por favores recibidos'
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

  it('should create a new TipoIntencion when posting valid data to /api/intentional-type', async () => {
    const { body } = await request(testServer.app)
      .post('/api/intentional-type')
      .send(tipoIntencion)
      .expect(200)

    id = body.id_tipointencion

    expect(body).toEqual({
      id_tipointencion: expect.any(Number),
      nombre: tipoIntencion.nombre,
      descripcion: tipoIntencion.descripcion
    })
  })

  it('should return a TipoIntencion when requesting /api/intentional-type/:id', async () => {
    // Prueba para obtener un tipo de intención por su ID
    const { body } = await request(testServer.app)
      .get(`/api/intentional-type/${id}`)
      .expect(200)

    expect(body).toEqual({
      id_tipointencion: expect.any(Number),
      nombre: tipoIntencion.nombre,
      descripcion: tipoIntencion.descripcion
    })
  })

  it('should return a list of TipoIntenciones from /api/intentional-type', async () => {
    // Prueba para obtener todos los tipos de intención
    const { body } = await request(testServer.app)
      .get('/api/intentional-type')
      .expect(200)

    expect(body.data).toBeInstanceOf(Array)
  })

  it('should return error when creating a duplicate TipoIntencion', async () => {
    // Prueba para un caso de fallo: crear un tipo de intención duplicado
    const { body } = await request(testServer.app)
      .post('/api/intentional-type')
      .send(tipoIntencion)
      .expect(400)

    expect(body.error).toBe('A Type of Intention with that name already exists.')
  })

  it('should return error when getting a non-existing TipoIntencion', async () => {
    // Prueba para un caso de fallo: obtener un ID que no existe
    const { body } = await request(testServer.app)
      .get('/api/intentional-type/99999')
      .expect(400)

    expect(body.error).toBe('The requested Type of Intention was not found.')
  })

  it('should return error when updating a non-existing TipoIntencion', async () => {
    // Prueba para un caso de fallo: actualizar un ID que no existe
    const { body } = await request(testServer.app)
      .put('/api/intentional-type/99999')
      .send({ nombre: 'Test' })
      .expect(400)

    expect(body.error).toBe('The requested Type of Intention was not found.')
  })

  it('should update a TipoIntencion when calling PUT on /api/intentional-type/:id', async () => {
    // Prueba para la actualización de un tipo de intención
    const updatedData = {
      nombre: 'Acción de gracias modificada',
      descripcion: 'Intención modificada'
    }
    const { body } = await request(testServer.app)
      .put(`/api/intentional-type/${id}`)
      .send(updatedData)
      .expect(200)

    expect(body).toEqual({
      id_tipointencion: expect.any(Number),
      nombre: updatedData.nombre,
      descripcion: updatedData.descripcion
    })
  })

  it('should delete a TipoIntencion when calling DELETE on /api/intentional-type/:id', async () => {
    // Prueba para la eliminación exitosa de un tipo de intención
    const { body } = await request(testServer.app)
      .delete(`/api/intentional-type/${id}`)
      .expect(200)

    expect(body.message).toBe('Type of Intention successfully deleted')
  })

  it('should return error when deleting a non-existing TipoIntencion', async () => {
    // Prueba para un caso de fallo: eliminar un ID que no existe
    const { body } = await request(testServer.app)
      .delete('/api/intentional-type/99999')
      .expect(400)

    expect(body.error).toBe('The requested Type of Intention was not found.')
  })
})

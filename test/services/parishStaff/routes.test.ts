/* eslint-disable @typescript-eslint/restrict-template-expressions */
import request from 'supertest'
import { testServer } from '../../presentation/test-server'

describe('PersonalParroquial route testing', () => {
  // Objeto de datos de prueba para el personal parroquial
  const personal = {
    nombre: 'Juan',
    apellido: 'Pérez',
    direccion: 'Calle Falsa 123',
    telefono: '555-1234',
    email: 'juan.perez@example.com',
    idRol: 1
  }
  const personal2 = {
    nombre: 'Ana',
    apellido: 'García',
    direccion: 'Avenida Siempre Viva 742',
    telefono: '555-5678',
    email: 'ana.garcia@example.com',
    idRol: 1
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

  it('should create a new PersonalParroquial when posting valid data to /api/parish-staff', async () => {
    // Prueba para la creación exitosa de un registro de personal
    const { body } = await request(testServer.app)
      .post('/api/parish-staff')
      .send(personal)
      .expect(200)

    id = body.id_personal

    // Se verifica que la respuesta contenga los datos correctos
    expect(body).toEqual({
      id_personal: expect.any(Number),
      nombre: personal.nombre,
      apellido: personal.apellido,
      direccion: personal.direccion,
      telefono: personal.telefono,
      email: personal.email,
      id_rol: personal.idRol
    })
  })

  it('should return a PersonalParroquial when requesting /api/parish-staff/:id', async () => {
    // Prueba para obtener un registro de personal por su ID
    const { body } = await request(testServer.app)
      .get(`/api/parish-staff/${id}`)
      .expect(200)

    // Se verifica que la respuesta sea el objeto esperado
    expect(body).toEqual({
      id_personal: expect.any(Number),
      nombre: personal.nombre,
      apellido: personal.apellido,
      direccion: personal.direccion,
      telefono: personal.telefono,
      email: personal.email,
      personal_rol: expect.any(Object)
    })
  })

  it('should return a list of PersonalParroquiales from /api/parish-staff', async () => {
    // Se crea un segundo registro para asegurar que la lista contenga más de un elemento
    await request(testServer.app).post('/api/parish-staff').send(personal2).expect(200)

    // Prueba para obtener todos los registros de personal
    const { body } = await request(testServer.app)
      .get('/api/parish-staff')
      .expect(200)

    // Se verifica que la respuesta contenga un array de datos
    expect(body.data).toBeInstanceOf(Array)
    //  expect(body.data.length).toBeGreaterThanOrEqual(2)
  })

  it('should return error when creating a duplicate PersonalParroquial email', async () => {
    // Prueba para un caso de fallo: crear un registro con un email duplicado
    const { body } = await request(testServer.app)
      .post('/api/parish-staff')
      .send(personal)
      .expect(400)

    // Se verifica el mensaje de error
    expect(body.error).toBe('A PersonalParroquial with that email already exists.')
  })

  it('should return error when getting a non-existing PersonalParroquial', async () => {
    // Prueba para un caso de fallo: obtener un ID que no existe
    const { body } = await request(testServer.app)
      .get('/api/parish-staff/99999')
      .expect(400)

    // Se verifica el mensaje de error
    expect(body.error).toBe('The requested PersonalParroquial was not found.')
  })

  it('should return error when updating a non-existing PersonalParroquial', async () => {
    // Prueba para un caso de fallo: actualizar un ID que no existe
    const { body } = await request(testServer.app)
      .put('/api/parish-staff/99999')
      .send({ nombre: 'Test' })
      .expect(400)

    // Se verifica el mensaje de error
    expect(body.error).toBe('The requested PersonalParroquial was not found.')
  })

  it('should update a PersonalParroquial when calling PUT on /api/parish-staff/:id', async () => {
    // Prueba para la actualización de un registro de personal
    const updatedData = {
      nombre: 'Juan Carlos',
      email: 'juan.carlos@example.com'
    }
    const { body } = await request(testServer.app)
      .put(`/api/parish-staff/${id}`)
      .send(updatedData)
      .expect(200)

    // Se verifica que la respuesta sea el objeto actualizado
    expect(body).toEqual({
      id_personal: expect.any(Number),
      nombre: updatedData.nombre,
      apellido: personal.apellido,
      direccion: personal.direccion,
      telefono: personal.telefono,
      email: updatedData.email
    })
  })

  it('should delete a PersonalParroquial when calling DELETE on /api/parish-staff/:id', async () => {
    // Prueba para la eliminación exitosa de un registro de personal
    const { body } = await request(testServer.app)
      .delete(`/api/parish-staff/${id}`)
      .expect(200)

    // Se verifica el mensaje de éxito
    expect(body.message).toBe('PersonalParroquial successfully deleted')
  })

  it('should return error when deleting a non-existing PersonalParroquial', async () => {
    // Prueba para un caso de fallo: eliminar un ID que no existe
    const { body } = await request(testServer.app)
      .delete('/api/parish-staff/99999')
      .expect(400)

    // Se verifica el mensaje de error
    expect(body.error).toBe('The requested PersonalParroquial was not found.')
  })
})

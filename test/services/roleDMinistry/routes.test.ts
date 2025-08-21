/* eslint-disable @typescript-eslint/restrict-template-expressions */
import request from 'supertest'
import { testServer } from '../../presentation/test-server'

describe('RolDentroMinisterio route testing', () => {
  // Objeto de datos de prueba para un rol dentro de ministerio
  const rolDentroMinisterio = {
    nombre: 'Director',
    descripcion: 'Encargado de coordinar las actividades del ministerio'
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

  it('should create a new RolDentroMinisterio when posting valid data to /api/role-d-ministry', async () => {
    // Prueba para la creación exitosa de un rol
    const { body } = await request(testServer.app)
      .post('/api/role-d-ministry')
      .send(rolDentroMinisterio)
      .expect(200)

    id = body.id_roldentroministerio

    // Se verifica que la respuesta contenga los datos correctos
    expect(body).toEqual({
      id_roldentroministerio: expect.any(Number),
      nombre: rolDentroMinisterio.nombre,
      descripcion: rolDentroMinisterio.descripcion
    })
  })

  it('should return a RolDentroMinisterio when requesting /api/role-d-ministry/:id', async () => {
    // Prueba para obtener un rol por su ID
    const { body } = await request(testServer.app)
      .get(`/api/role-d-ministry/${id}`)
      .expect(200)

    // Se verifica que la respuesta sea el objeto esperado
    expect(body).toEqual({
      id_roldentroministerio: expect.any(Number),
      nombre: rolDentroMinisterio.nombre,
      descripcion: rolDentroMinisterio.descripcion
    })
  })

  it('should return a list of RolDentroMinisterios from /api/role-d-ministry', async () => {
    // Prueba para obtener todos los roles
    const { body } = await request(testServer.app)
      .get('/api/role-d-ministry')
      .expect(200)

    // Se verifica que la respuesta contenga un array de datos
    expect(body.data).toBeInstanceOf(Array)
  })

  it('should return error when creating a duplicate RolDentroMinisterio', async () => {
    // Prueba para un caso de fallo: crear un rol duplicado
    const { body } = await request(testServer.app)
      .post('/api/role-d-ministry')
      .send(rolDentroMinisterio)
      .expect(400)

    // Se verifica el mensaje de error
    expect(body.error).toBe('A RolDentroMinisterio with that name already exists.')
  })

  it('should return error when getting a non-existing RolDentroMinisterio', async () => {
    // Prueba para un caso de fallo: obtener un ID que no existe
    const { body } = await request(testServer.app)
      .get('/api/role-d-ministry/99999')
      .expect(400)

    // Se verifica el mensaje de error
    expect(body.error).toBe('The requested RolDentroMinisterio was not found.')
  })

  it('should return error when updating a non-existing RolDentroMinisterio', async () => {
    // Prueba para un caso de fallo: actualizar un ID que no existe
    const { body } = await request(testServer.app)
      .put('/api/role-d-ministry/99999')
      .send({ nombre: 'Test' })
      .expect(400)

    // Se verifica el mensaje de error
    expect(body.error).toBe('The requested RolDentroMinisterio was not found.')
  })

  it('should update a RolDentroMinisterio when calling PUT on /api/role-d-ministry/:id', async () => {
    // Prueba para la actualización de un rol
    const updatedData = {
      nombre: 'Subdirector',
      descripcion: 'Encargado de apoyar en la coordinación del ministerio'
    }
    const { body } = await request(testServer.app)
      .put(`/api/role-d-ministry/${id}`)
      .send(updatedData)
      .expect(200)

    // Se verifica que la respuesta sea el objeto actualizado
    expect(body).toEqual({
      id_roldentroministerio: expect.any(Number),
      nombre: updatedData.nombre,
      descripcion: updatedData.descripcion
    })
  })

  it('should delete a RolDentroMinisterio when calling DELETE on /api/role-d-ministry/:id', async () => {
    // Prueba para la eliminación exitosa de un rol
    const { body } = await request(testServer.app)
      .delete(`/api/role-d-ministry/${id}`)
      .expect(200)

    // Se verifica el mensaje de éxito
    expect(body.message).toBe('RolDentroMinisterio successfully deleted')
  })

  it('should return error when deleting a non-existing RolDentroMinisterio', async () => {
    // Prueba para un caso de fallo: eliminar un ID que no existe
    const { body } = await request(testServer.app)
      .delete('/api/role-d-ministry/99999')
      .expect(400)

    // Se verifica el mensaje de error
    expect(body.error).toBe('The requested RolDentroMinisterio was not found.')
  })
})

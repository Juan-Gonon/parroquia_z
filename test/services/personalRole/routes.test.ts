/* eslint-disable @typescript-eslint/restrict-template-expressions */
import request from 'supertest'
import { testServer } from '../../presentation/test-server'

describe('RolPersonal route testing', () => {
  // Objeto de datos de prueba para un rol de personal
  const rolPersonal = {
    nombre: 'Administrador',
    descripcion: 'Rol con permisos de administración completa del sistema',
    permisos: '{"users": "crud", "communities": "crud", "all": "all"}'
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

  it('should create a new RolPersonal when posting valid data to /api/roles-personal', async () => {
    // Prueba para la creación exitosa de un rol de personal
    const { body } = await request(testServer.app)
      .post('/api/personal-role/')
      .send(rolPersonal)
      .expect(200)

    id = body.id_rol

    expect(body).toEqual({
      id_rol: expect.any(Number),
      nombre: rolPersonal.nombre,
      descripcion: rolPersonal.descripcion,
      permisos: rolPersonal.permisos
    })
  })

  it('should return a RolPersonal when requesting /api/personal-role/:id', async () => {
    // Prueba para obtener un rol de personal por su ID
    const { body } = await request(testServer.app)
      .get(`/api/personal-role/${id}`)
      .expect(200)

    expect(body).toEqual({
      id_rol: expect.any(Number),
      nombre: rolPersonal.nombre,
      descripcion: rolPersonal.descripcion,
      permisos: rolPersonal.permisos
    })
  })

  it('should return a list of RolPersonales from /api/personal-role/', async () => {
    // Prueba para obtener todos los roles de personal
    const { body } = await request(testServer.app)
      .get('/api/personal-role/')
      .expect(200)

    expect(body.data).toBeInstanceOf(Array)
  })

  it('should return error when creating a duplicate RolPersonal', async () => {
    // Prueba para un caso de fallo: crear un rol de personal duplicado
    const { body } = await request(testServer.app)
      .post('/api/personal-role')
      .send(rolPersonal)
      .expect(400)

    expect(body.error).toBe('A RolPersonal with that name already exists.')
  })

  it('should return error when getting a non-existing RolPersonal', async () => {
    // Prueba para un caso de fallo: obtener un ID que no existe
    const { body } = await request(testServer.app)
      .get('/api/personal-role/99999')
      .expect(400)

    expect(body.error).toBe('The requested RolPersonal was not found.')
  })

  it('should return error when updating a non-existing RolPersonal', async () => {
    // Prueba para un caso de fallo: actualizar un ID que no existe
    const { body } = await request(testServer.app)
      .put('/api/personal-role/99999')
      .send({ nombre: 'Test' })
      .expect(400)

    expect(body.error).toBe('The requested RolPersonal was not found.')
  })

  it('should update a RolPersonal when calling PUT on /api/personal-role//:id', async () => {
    // Prueba para la actualización de un rol de personal
    const updatedData = {
      nombre: 'Admin Modificado',
      descripcion: 'Rol con permisos de administración modificados',
      permisos: '{"users": "crud"}'
    }
    const { body } = await request(testServer.app)
      .put(`/api/personal-role/${id}`)
      .send(updatedData)
      .expect(200)

    expect(body).toEqual({
      id_rol: expect.any(Number),
      nombre: updatedData.nombre,
      descripcion: updatedData.descripcion,
      permisos: updatedData.permisos
    })
  })

  it('should delete a RolPersonal when calling DELETE on /api/personal-role//:id', async () => {
    // Prueba para la eliminación exitosa de un rol de personal
    const { body } = await request(testServer.app)
      .delete(`/api/personal-role/${id}`)
      .expect(200)

    expect(body.message).toBe('RolPersonal successfully deleted')
  })

  it('should return error when deleting a non-existing RolPersonal', async () => {
    // Prueba para un caso de fallo: eliminar un ID que no existe
    const { body } = await request(testServer.app)
      .delete('/api/personal-role/99999')
      .expect(400)

    expect(body.error).toBe('The requested RolPersonal was not found.')
  })
})

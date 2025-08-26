/* eslint-disable @typescript-eslint/restrict-template-expressions */
import request from 'supertest'
import { testServer } from '../../presentation/test-server'

describe('GrupoServicio route testing', () => {
  // Datos de prueba para un ministerio y un grupo de servicio
  const ministerioId: number = 1

  const grupo = {
    nombre: 'Grupo de Oración',
    descripcion: 'Grupo dedicado a la oración y la intercesión',
    activo: true
  }

  let grupoId: number

  beforeAll(async () => {
    // Inicia el servidor de prueba antes de todas las pruebas
    await testServer.start()
  })

  afterAll(async () => {
    // Cierra el servidor y limpia la base de datos después de todas las pruebas
    await testServer.close()
  })

  it('should create a new GrupoServicio with valid data', async () => {
    const { body } = await request(testServer.app)
      .post('/api/service-group')
      .send({ ...grupo, idMinisterio: ministerioId })
      .expect(200)

    grupoId = body.id_grupo

    // Se verifica que la respuesta contenga los datos correctos del grupo
    expect(body).toEqual({
      id_grupo: expect.any(Number),
      nombre: grupo.nombre,
      descripcion: grupo.descripcion,
      activo: grupo.activo,
      id_ministerio: ministerioId
    })
  })

  it('should return a GrupoServicio when requesting by ID', async () => {
    // Prueba para obtener un registro de grupo por su ID
    const { body } = await request(testServer.app)
      .get(`/api/service-group/${grupoId}`)
      .expect(200)

    // Se verifica que la respuesta sea el objeto esperado
    expect(body).toEqual({
      id_grupo: expect.any(Number),
      nombre: grupo.nombre,
      descripcion: grupo.descripcion,
      activo: grupo.activo,
      id_ministerio: ministerioId
    })
  })

  it('should return a list of GrupoServicios from /api/service-group', async () => {
    // Prueba para obtener todos los registros de grupo
    const { body } = await request(testServer.app)
      .get('/api/service-group')
      .expect(200)

    // Se verifica que la respuesta contenga un array de datos
    expect(body.data).toBeInstanceOf(Array)
    //  expect(body.data.length).toBeGreaterThanOrEqual(2)
  })

  // Casos de error
  it('should return error when creating a duplicate GrupoServicio name', async () => {
    const { body } = await request(testServer.app)
      .post('/api/service-group')
      .send({ ...grupo, idMinisterio: ministerioId })
      .expect(400)

    // Se verifica el mensaje de error
    expect(body.error).toBe('A GrupoServicio with that name already exists.')
  })

  it('should return error when getting a non-existing GrupoServicio', async () => {
    // Prueba para un caso de fallo: obtener un ID que no existe
    const { body } = await request(testServer.app)
      .get('/api/service-group/99999')
      .expect(400)

    // Se verifica el mensaje de error
    expect(body.error).toBe('The requested GrupoServicio was not found.')
  })

  it('should update a GrupoServicio when calling PUT on /api/service-group/:id', async () => {
    // Prueba para la actualización de un registro de grupo
    const updatedData = {
      nombre: 'Grupo de Oración y Alabanza',
      descripcion: 'Grupo que se dedica a la oración y la alabanza',
      activo: false
    }
    const { body } = await request(testServer.app)
      .put(`/api/service-group/${grupoId}`)
      .send(updatedData)
      .expect(200)

    // Se verifica que la respuesta sea el objeto actualizado
    expect(body).toEqual({
      id_grupo: expect.any(Number),
      nombre: updatedData.nombre,
      descripcion: updatedData.descripcion,
      activo: updatedData.activo,
      id_ministerio: ministerioId
    })
  })

  it('should return error when updating a non-existing GrupoServicio', async () => {
    // Prueba para un caso de fallo: actualizar un ID que no existe
    const { body } = await request(testServer.app)
      .put('/api/service-group/99999')
      .send({ nombre: 'Test' })
      .expect(400)

    // Se verifica el mensaje de error
    expect(body.error).toBe('The requested GrupoServicio was not found.')
  })

  it('should delete a GrupoServicio when calling DELETE on /api/service-group/:id', async () => {
    // Prueba para la eliminación exitosa de un registro de grupo
    const { body } = await request(testServer.app)
      .delete(`/api/service-group/${grupoId}`)
      .expect(200)

    // Se verifica el mensaje de éxito
    expect(body.message).toBe('GrupoServicio successfully deleted')
  })

  it('should return error when deleting a non-existing GrupoServicio', async () => {
    // Prueba para un caso de fallo: eliminar un ID que no existe
    const { body } = await request(testServer.app)
      .delete('/api/service-group/99999')
      .expect(400)

    // Se verifica el mensaje de error
    expect(body.error).toBe('The requested GrupoServicio was not found.')
  })
})

/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import request from 'supertest'
import { testServer } from '../../presentation/test-server'
import { prisma } from '../../../src/data/postgress'

describe('AsigGrupoEvento route testing', () => {
  let createdEventoId: number
  let createdGrupoServicioId: number
  let createdAsignacionId: number

  const testAsignacion = {
    idEvento: 1,
    idGrpSrv: 1,
    notas: 'Test notes for assignment'
  }

  beforeAll(async () => {
    await testServer.start()

    // Crear dependencias para los tests
    const evento = await prisma.evento.create({
      data: {
        nombre: 'Test Evento',
        fecha_ini: new Date(),
        aceptaintenciones: true,
        id_comunidad: 1,
        id_tipoevento: 1,
        id_celebrante: 1
      }
    })
    createdEventoId = evento.id_evento

    const grupoServicio = await prisma.gruposervicio.create({
      data: {
        nombre: 'Test Grupo Servicio',
        activo: true,
        id_ministerio: 1
      }
    })
    createdGrupoServicioId = grupoServicio.id_grupo

    testAsignacion.idEvento = createdEventoId
    testAsignacion.idGrpSrv = createdGrupoServicioId
  })

  afterAll(async () => {
    await prisma.asiggrupoevento.deleteMany()
    await prisma.evento.delete({ where: { id_evento: createdEventoId } })
    await prisma.gruposervicio.delete({ where: { id_grupo: createdGrupoServicioId } })
    await testServer.close()
  })

  // Test de creación
  it('should create a new AsigGrupoEvento when making a POST request to /api/asigeventgroup', async () => {
    const { body } = await request(testServer.app)
      .post('/api/asigeventgroup')
      .send(testAsignacion)
      .expect(200)

    createdAsignacionId = body.id_asig_ge

    expect(body).toEqual({
      id_asig_ge: expect.any(Number),
      id_evento: testAsignacion.idEvento,
      id_grp_srv: testAsignacion.idGrpSrv,
      notas: testAsignacion.notas
    })
  })

  // Test de obtención por ID
  it('should return an AsigGrupoEvento by ID when making a GET request to /api/asigeventgroup/:id', async () => {
    const { body } = await request(testServer.app)
      .get(`/api/asigeventgroup/${createdAsignacionId}`)
      .expect(200)

    expect(body).toEqual({
      id_asig_ge: createdAsignacionId,
      id_evento: testAsignacion.idEvento,
      id_grp_srv: testAsignacion.idGrpSrv,
      notas: testAsignacion.notas
    })
  })

  // Test de obtención de todos los registros con paginación
  it('should return all AsigGrupoEvento with pagination when making a GET request to /api/asigeventgroup', async () => {
    const { body } = await request(testServer.app).get('/api/asigeventgroup').expect(200)

    expect(body.data).toBeInstanceOf(Array)
  })

  // Test de actualización
  it('should update an AsigGrupoEvento when making a PUT request to /api/asigeventgroup/:id', async () => {
    const updatedNotas = { notas: 'Updated notes' }
    const { body } = await request(testServer.app)
      .put(`/api/asigeventgroup/${createdAsignacionId}`)
      .send(updatedNotas)
      .expect(200)

    expect(body.notas).toBe(updatedNotas.notas)
  })

  // Test de eliminación
  it('should delete an AsigGrupoEvento when making a DELETE request to /api/asigeventgroup/:id', async () => {
    const { body } = await request(testServer.app)
      .delete(`/api/asigeventgroup/${createdAsignacionId}`)
      .expect(200)

    expect(body.message).toBe(`Asignacion with id ${createdAsignacionId} deleted`)

    // Verificar que el registro ya no existe
    await request(testServer.app)
      .get(`/api/asigeventgroup/${createdAsignacionId}`)
      .expect(404)
  })
})

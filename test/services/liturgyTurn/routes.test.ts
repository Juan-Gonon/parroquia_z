/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import request from 'supertest'
import { testServer } from '../../presentation/test-server'
import { prisma } from '../../../src/data/postgress'

describe('TurnoLiturgicoComunitario route testing', () => {
  // Variables para almacenar los IDs de los registros creados para los tests
  let id: number
  let createdParroquiaId: number
  let createdComunidadId: number
  let createdTipoTurnoId: number

  // Se ejecuta una vez antes de todos los tests para crear los datos de las dependencias
  beforeAll(async () => {
    await testServer.start()

    // Paso 1: Crear una parroquia, ya que Comunidad depende de ella
    const parroquia = await prisma.parroquia.create({
      data: {
        nombre: 'Test Parroquia',
        direccion: 'Test Direccion'
      }
    })
    createdParroquiaId = parroquia.id_parroquia

    // Paso 2: Crear una comunidad, ya que TurnoLiturgicoComunitario depende de ella
    const comunidad = await prisma.comunidad.create({
      data: {
        nombre: 'Test Comunidad',
        direccion: 'Test Direccion',
        id_parroquia: createdParroquiaId
      }
    })
    createdComunidadId = comunidad.id_comunidad

    // Paso 3: Crear un tipo de turno, ya que TurnoLiturgicoComunitario depende de él
    const tipoTurno = await prisma.tipoturno.create({
      data: {
        nombre: 'Test Tipo Turno'
      }
    })
    createdTipoTurnoId = tipoTurno.id_tipo
  })

  // Se ejecuta una vez después de todos los tests para limpiar la base de datos
  afterAll(async () => {
    // Limpiar en orden inverso para evitar errores de claves foráneas
    await prisma.turnoliturgocomunitario.deleteMany()
    await prisma.comunidad.delete({ where: { id_comunidad: createdComunidadId } })
    await prisma.tipoturno.delete({ where: { id_tipo: createdTipoTurnoId } })
    await prisma.parroquia.delete({ where: { id_parroquia: createdParroquiaId } })
    await testServer.close()
  })

  it('should create a new turno when making a POST request to /api/liturgy-turns', async () => {
    const turnoData = {
      idComunidad: createdComunidadId,
      idTipoTurno: createdTipoTurnoId,
      fechaIni: '2025-01-01',
      descripcion: 'Test Descripcion',
      fechaFin: '2025-01-31'
    }
    const { body } = await request(testServer.app)
      .post('/api/liturgy-turns')
      .send(turnoData)
      .expect(200)

    id = body.id_turno

    expect(body).toEqual({
      id_turno: expect.any(Number),
      id_comunidad: turnoData.idComunidad,
      id_tipo: turnoData.idTipoTurno,
      fecha_inicio: `${turnoData.fechaIni}T00:00:00.000Z`,
      descripcion: turnoData.descripcion,
      fecha_fin: `${turnoData.fechaFin}T00:00:00.000Z`
    })
  })

  it('should return all turnos with pagination when making a GET request to /api/liturgy-turns', async () => {
    const { body } = await request(testServer.app).get('/api/liturgy-turns').expect(200)
    expect(body.turnos).toBeInstanceOf(Array)
  })

  it('should return a turno by ID when making a GET request to /api/liturgy-turns/:id', async () => {
    const { body } = await request(testServer.app).get(`/api/liturgy-turns/${id}`).expect(200)

    expect(body).toEqual({
      id_turno: id,
      id_comunidad: createdComunidadId,
      id_tipo: createdTipoTurnoId,
      fecha_inicio: '2025-01-01T00:00:00.000Z',
      descripcion: 'Test Descripcion',
      fecha_fin: '2025-01-31T00:00:00.000Z'
    })
  })

  it('should return an error when updating a non-existing turno', async () => {
    const { body } = await request(testServer.app)
      .put('/api/liturgy-turns/999')
      .send({ descripcion: 'Non-existing' })
      .expect(400)

    expect(body.error).toBe('The specified turno liturgico does not exist')
  })

  it('should update a turno when making a PUT request to /api/liturgy-turns/:id', async () => {
    const updatedTurno = { descripcion: 'Updated Description', fechaFin: '2025-02-15' }
    const { body } = await request(testServer.app)
      .put(`/api/liturgy-turns/${id}`)
      .send(updatedTurno)
      .expect(200)

    expect(body).toEqual({
      id_turno: id,
      id_comunidad: createdComunidadId,
      id_tipo: createdTipoTurnoId,
      fecha_inicio: '2025-01-01T00:00:00.000Z',
      descripcion: updatedTurno.descripcion,
      fecha_fin: `${updatedTurno.fechaFin}T00:00:00.000Z`
    })
  })

  it('should delete a turno when making a DELETE request to /api/liturgy-turns/:id', async () => {
    const { body } = await request(testServer.app).delete(`/api/liturgy-turns/${id}`).expect(200)
    expect(body.message).toBe('Turno deleted successfully')
  })

  it('should return an error when deleting a non-existing turno', async () => {
    const { body } = await request(testServer.app).delete('/api/liturgy-turns/999').expect(400)
    expect(body.error).toBe('The specified turno liturgico does not exist')
  })
})

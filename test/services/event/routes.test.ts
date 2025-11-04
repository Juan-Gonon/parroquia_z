/* eslint-disable @typescript-eslint/restrict-template-expressions */
import request from 'supertest'
import { testServer } from '../../presentation/test-server'

describe('Evento route testing', () => {
  // Datos de prueba para Comunidad, TipoEvento y PersonalParroquial
  const comunidadId: number = 2
  const tipoEventoId: number = 3
  const celebranteId: number = 2

  const eventoData = {
    nombre: 'Misa Dominical',
    fechaIni: '2025-08-27T10:00:00.000Z',
    fechaFin: '2025-08-28T11:00:00.000Z',
    descripcion: 'Misa de la parroquia para toda la comunidad',
    aceptaIntenciones: true,
    requiereInscripcion: true
  }
  let eventoId: number

  beforeAll(async () => {
    // Iniciar servidor
    await testServer.start()
  })

  afterAll(async () => {
    // Cerrar servidor
    await testServer.close()
  })

  it('should create a new Evento with valid data', async () => {
    const { body } = await request(testServer.app)
      .post('/api/event')
      .send({
        ...eventoData,
        idComunidad: comunidadId,
        idTipoEvento: tipoEventoId,
        idCelebrante: celebranteId
      })
      .expect(200)

    eventoId = body.id_evento

    // Se verifica que la respuesta contenga los datos correctos del evento
    expect(body).toEqual({
      id_evento: expect.any(Number),
      nombre: eventoData.nombre,
      fecha_ini: eventoData.fechaIni,
      fecha_fin: eventoData.fechaFin,
      descripcion: eventoData.descripcion,
      id_comunidad: comunidadId,
      id_tipoevento: tipoEventoId,
      aceptaintenciones: eventoData.aceptaIntenciones,
      requiereinscripcion: eventoData.requiereInscripcion,
      id_celebrante: celebranteId,
      nombrecelebranteexterno: null
    })
  })

  it('should return an Evento when requesting by ID', async () => {
    // Prueba para obtener un registro de evento por su ID
    const { body } = await request(testServer.app)
      .get(`/api/event/${eventoId}`)
      .expect(200)

    // Se verifica que la respuesta sea el objeto esperado
    expect(body).toEqual({
      id_evento: expect.any(Number),
      nombre: eventoData.nombre,
      fecha_ini: eventoData.fechaIni,
      fecha_fin: eventoData.fechaFin,
      descripcion: eventoData.descripcion,
      id_comunidad: comunidadId,
      id_tipoevento: tipoEventoId,
      aceptaintenciones: eventoData.aceptaIntenciones,
      requiereinscripcion: eventoData.requiereInscripcion,
      id_celebrante: celebranteId,
      nombrecelebranteexterno: null
    })
  })

  it('should return a list of Eventos from /api/evento', async () => {
    // Prueba para obtener todos los registros de evento
    const { body } = await request(testServer.app).get('/api/event').expect(200)

    // Se verifica que la respuesta contenga un array de datos
    expect(body.data).toBeInstanceOf(Array)
    //  expect(body.data.length).toBeGreaterThanOrEqual(1)
  })

  // Casos de error
  it('should return error when creating an event with a non-existing community', async () => {
    // Prueba para un caso de fallo: comunidad que no existe
    const { body } = await request(testServer.app)
      .post('/api/event')
      .send({
        ...eventoData,
        idComunidad: 99999,
        idTipoEvento: tipoEventoId,
        idCelebrante: celebranteId
      })
      .expect(400)
    expect(body.error).toBe('The specified community does not exist.')
  })

  it('should return error when creating an event with a non-existing event type', async () => {
    // Prueba para un caso de fallo: tipo de evento que no existe
    const { body } = await request(testServer.app)
      .post('/api/event')
      .send({
        ...eventoData,
        idComunidad: comunidadId,
        idTipoEvento: 99999,
        idCelebrante: celebranteId
      })
      .expect(400)
    expect(body.error).toBe('The specified event type does not exist.')
  })

  it('should return error when creating an event with a non-existing celebrant', async () => {
    // Prueba para un caso de fallo: celebrante que no existe
    const { body } = await request(testServer.app)
      .post('/api/event')
      .send({
        ...eventoData,
        idComunidad: comunidadId,
        idTipoEvento: tipoEventoId,
        idCelebrante: 99999
      })
      .expect(400)
    expect(body.error).toBe('The specified celebrant does not exist.')
  })

  it('should return error when creating an event with both celebrant and external celebrant name', async () => {
    // Prueba para un caso de fallo: se proporcionan ambos campos de celebrante
    const { body } = await request(testServer.app)
      .post('/api/event')
      .send({
        ...eventoData,
        idComunidad: comunidadId,
        idTipoEvento: tipoEventoId,
        idCelebrante: celebranteId,
        nombreCelebranteExterno: 'Test name'
      })
      .expect(400)
    expect(body.error).toBe('Exactly one of idCelebrante or nombreCelebranteExterno must be provided.')
  })

  it('should return error when getting a non-existing Evento', async () => {
    // Prueba para un caso de fallo: obtener un ID que no existe
    const { body } = await request(testServer.app).get('/api/event/99999').expect(400)
    expect(body.error).toBe('The requested event was not found.')
  })

  it('should update an Evento when calling PUT on /api/evento/:id', async () => {
    // Prueba para la actualización de un registro de evento
    const updatedData = {
      nombre: 'Misa de la mañana',
      descripcion: 'Misa de la mañana en la parroquia'
    }
    const { body } = await request(testServer.app)
      .put(`/api/event/${eventoId}`)
      .send(updatedData)
      .expect(200)

    // Se verifica que la respuesta sea el objeto actualizado
    expect(body).toEqual({
      id_evento: expect.any(Number),
      nombre: updatedData.nombre,
      fecha_ini: eventoData.fechaIni,
      fecha_fin: eventoData.fechaFin,
      descripcion: updatedData.descripcion,
      id_comunidad: comunidadId,
      id_tipoevento: tipoEventoId,
      aceptaintenciones: eventoData.aceptaIntenciones,
      requiereinscripcion: eventoData.requiereInscripcion,
      id_celebrante: celebranteId,
      nombrecelebranteexterno: null
    })
  })

  it('should return error when updating a non-existing Evento', async () => {
    // Prueba para un caso de fallo: actualizar un ID que no existe
    const { body } = await request(testServer.app)
      .put('/api/event/99999')
      .send({ nombre: 'Test' })
      .expect(400)
    expect(body.error).toBe('The requested event was not found.')
  })

  it('should return error when deleting a non-existing Evento', async () => {
    // Prueba para un caso de fallo: eliminar un ID que no existe
    const { body } = await request(testServer.app)
      .delete('/api/event/99999')
      .expect(400)
    expect(body.error).toBe('The requested event was not found.')
  })

  it('should delete an Evento when calling DELETE on /api/evento/:id', async () => {
    // Prueba para la eliminación exitosa de un registro de evento
    const { body } = await request(testServer.app)
      .delete(`/api/event/${eventoId}`)
      .expect(200)

    // Se verifica el mensaje de éxito
    expect(body.message).toBe('Event successfully deleted')
  })
})

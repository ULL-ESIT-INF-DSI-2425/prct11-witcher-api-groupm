import { describe, test, expect, beforeEach } from "vitest";
import request from 'supertest';
import { app } from '../src/app.js';
import { Mercader } from '../src/models/Mercaderes.js'

beforeEach(async () => {
  await Mercader.deleteMany();
});

describe('Peticiones POST para los mercaderes', () => {
  test('POST /merchants - Crear mercader', async () => {
    const response = await request(app).post('/merchants').send({
      nombre: 'Hattori',
      tipo: 'Herrero',
      ubicacion: 'Novigrado'
    });
    expect(response.status).toBe(201);
    expect(response.body.nombre).toBe('Hattori');
    expect(response.body.tipo).toBe('Herrero');
    expect(response.body.ubicacion).toBe('Novigrado');

    // Eliminar el mercader creado
    await request(app).delete(`/merchants?nombre=Hattori`);
  });

  test('POST /merchants - Crear mercader duplicado', async () => {
    await request(app).post('/merchants').send({
      nombre: 'Hattori',
      tipo: 'Herrero',
      ubicacion: 'Novigrado'
    });

    const response = await request(app).post('/merchants').send({
      nombre: 'Hattori',
      tipo: 'Herrero',
      ubicacion: 'Novigrado'
    });
    expect(response.status).toBe(400);
    expect(response.text).toBe('Ya existe un mercader con el mismo nombre');

    // Eliminar el mercader creado
    await request(app).delete(`/merchants?nombre=Hattori`);
  });
});

describe('Peticiones GET para los mercaderes', () => {
  test('GET /merchants - Obtener todos los mercaderes, existiendo 1', async () => {
    await request(app).post('/merchants').send({
      nombre: 'Hattori',
      tipo: 'Herrero',
      ubicacion: 'Novigrado'
    });

    // await request(app).post('/merchants').send({
    //   nombre: 'Eibhear Hattori',
    //   tipo: 'Armero',
    //   ubicacion: 'Novigrado'
    // });

    const response = await request(app).get('/merchants');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].nombre).toBe('Hattori');
    // expect(response.body[1].nombre).toBe('Eibhear Hattori');

    // Eliminar a los mercaderes
    await request(app).delete(`/merchants?nombre=Hattori`);
    await request(app).delete(`/merchants?nombre=Eibhear%20Hattori`);
  });

  test('GET /merchants - Obtener el mercader buscándolo por su nombre', async () => {
    await request(app).post('/merchants').send({
      nombre: 'Hattori',
      tipo: 'Herrero',
      ubicacion: 'Novigrado'
    });

    const response = await request(app).get('/merchants?nombre=Hattori');
    expect(response.status).toBe(200);
    expect(response.body.nombre).toBe('Hattori');

    // Eliminar al mercader
    await request(app).delete(`/merchants?nombre=Hattori`);
  });

  test('GET /merchants - Error al obtener los mercaderes por la inexistencia de estos', async () => {
    const response = await request(app).get('/merchants');
    expect(response.text).toBe('No existe mercader con ese nombre');
    expect(response.status).toBe(404);
  });

  test('GET /merchants - Obtener el mercader buscándolo por ID', async () => {
    await request(app).post('/merchants').send({
      nombre: 'Hattori',
      tipo: 'Herrero',
      ubicacion: 'Novigrado'
    });
    const test = await request(app).get('/merchants?nombre=Hattori');
    const ID = test.body._id;

    const response = await request(app).get('/merchants/' + ID);
    expect(response.status).toBe(200);
    expect(response.body.nombre).toBe('Hattori');

    // Eliminar al mercader
    await request(app).delete(`/merchants?nombre=Hattori`);
  });

  test('GET /merchants - Error al obtener los mercaderes por su ID', async () => {
    const response = await request(app).get('/merchants/123');
    expect(response.status).toBe(500);
  });
});

describe('Peticiones PATCH para los mercaderes', () => {
  test('PATCH /merchants - Modificar mercader por nombre', async () => {
    await request(app).post('/merchants').send({
      nombre: 'Hattori',
      tipo: 'Herrero',
      ubicacion: 'Novigrado'
    });

    const response = await request(app).patch('/merchants?nombre=Hattori').send({
      tipo: 'Armero'
    });
    expect(response.status).toBe(200);
    expect(response.body.nombre).toBe('Hattori');
    expect(response.body.tipo).toBe('Armero');

    // Eliminar el mercader creado
    await request(app).delete(`/merchants?nombre=Hattori`);
  });

  test('PATCH /merchants - Error al modificar mercader por nombre, no encuentra al mercader', async () => {
    const response = await request(app).patch('/merchants?nombre=Hattori').send({
      tipo: 'Armero'
    });
    expect(response.status).toBe(400);
  });

  test('PATCH /merchants - Error al modificar mercader por nombre, no se envía body', async () => {
    await request(app).post('/merchants').send({
      nombre: 'Hattori',
      tipo: 'Herrero',
      ubicacion: 'Novigrado'
    });

    const response = await request(app).patch('/merchants?nombre=Hattori');
    expect(response.status).toBe(400);

    // Eliminar el mercader creado
    await request(app).delete(`/merchants?nombre=Hattori`);
  });

  test('PATCH /merchants - Error al modificar mercader por nombre, campo no permitido', async () => {
    await request(app).post('/merchants').send({
      nombre: 'Hattori',
      tipo: 'Herrero',
      ubicacion: 'Novigrado'
    });

    const response = await request(app).patch('/merchants?nombre=Hattori').send({
      edad: '40'
    });
    expect(response.status).toBe(400);
    expect(response.text).toBe('El cambio no está permitido');

    // Eliminar el mercader creado
    await request(app).delete(`/merchants?nombre=Hattori`);
  });

  test('PATCH /merchants - Error al modificar mercader por nombre, nombre erróneo', async () => {
    await request(app).post('/merchants').send({
      nombre: 'Hattori',
      tipo: 'Herrero',
      ubicacion: 'Novigrado'
    });

    const response = await request(app).patch('/merchants?nombre=Hattorii').send({
      tipo: 'Armero'
    });
    expect(response.status).toBe(400);
    expect(response.text).toBe('No existe mercader con ese nombre');

    // Eliminar el mercader creado
    await request(app).delete(`/merchants?nombre=Hattori`);
  });

  test('PATCH /merchants - Modificar mercader por ID', async () => {
    await request(app).post('/merchants').send({
      nombre: 'Hattori',
      tipo: 'Herrero',
      ubicacion: 'Novigrado'
    });
    const test = await request(app).get('/merchants?nombre=Hattori');
    const ID = test.body._id;

    const response = await request(app).patch('/merchants/' + ID).send({
      tipo: 'Armero'
    });
    expect(response.status).toBe(200);
    expect(response.body.nombre).toBe('Hattori');
    expect(response.body.tipo).toBe('Armero');

    // Eliminar el mercader creado
    await request(app).delete(`/merchants?nombre=Hattori`);
  });

  test('PATCH /merchants - Error al modificar mercader por ID, no se envía body', async () => {
    const response = await request(app).patch('/merchants/123');
    expect(response.status).toBe(400);
  });

  test('PATCH /merchants - Error al modificar mercader por ID, no existe el mercader', async () => {
    const response = await request(app).patch('/merchants/123').send({
      tipo: 'Armero'
    });
    expect(response.status).toBe(400);
  });

  test('PATCH /merchants - Error al modificar mercader por ID, campo no permitido', async () => {
    await request(app).post('/merchants').send({
      nombre: 'Hattori',
      tipo: 'Herrero',
      ubicacion: 'Novigrado'
    });
    const test = await request(app).get('/merchants?nombre=Hattori');
    const ID = test.body._id;

    const response = await request(app).patch('/merchants/' + ID).send({
      edad: '40'
    });
    expect(response.status).toBe(400);
    expect(response.text).toBe('El cambio no está permitido');

    // Eliminar el mercader creado
    await request(app).delete(`/merchants?nombre=Hattori`);
  });
});

describe('Peticiones DELETE para los mercaderes', () => {
  test('DELETE /merchants - Eliminar mercader por nombre', async () => {
    await request(app).post('/merchants').send({
      nombre: 'Hattori',
      tipo: 'Herrero',
      ubicacion: 'Novigrado'
    });

    const response = await request(app).delete('/merchants?nombre=Hattori');
    expect(response.status).toBe(200);
    expect(response.body.nombre).toBe('Hattori');
  });

  test('DELETE /merchants - Error al eliminar mercader por nombre, no existe el mercader', async () => {
    const response = await request(app).delete('/merchants?nombre=Hattori');
    expect(response.status).toBe(400);
    expect(response.text).toBe('No existe mercader con ese nombre');
  });

  test('DELETE /merchants - Eliminar mercader por ID', async () => {
    await request(app).post('/merchants').send({
      nombre: 'Hattori',
      tipo: 'Herrero',
      ubicacion: 'Novigrado'
    });
    const test = await request(app).get('/merchants?nombre=Hattori');
    const ID = test.body._id;

    const response = await request(app).delete('/merchants/' + ID);
    expect(response.status).toBe(200);
    expect(response.body.nombre).toBe('Hattori');
  });

  test('DELETE /merchants - Error al eliminar mercader por ID, no existe el mercader', async () => {
    const response = await request(app).delete('/merchants/123');
    expect(response.status).toBe(400);
  });
});
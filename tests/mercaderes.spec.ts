import { describe, test, expect, afterEach, beforeEach } from "vitest";
import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../src/app.js';
import { Mercader } from "../src/models/Mercaderes.js";

beforeEach(async () => {
  await request(app).post('/merchants').send({
    nombre: 'Hattori',
    tipo: 'Herrero',
    ubicacion: 'Novigrado'
  });
});

afterEach(async () => {
  await request(app).delete(`/merchants?nombre=Hattori`);
  if (mongoose.connection.readyState !== 0) {
    await Mercader.deleteMany({});
  }
});



describe('Peticiones POST para los mercaderes', () => {
  test('POST /merchants - Crear mercader', async () => {
    const response = await request(app).post('/merchants').send({
      nombre: 'Carlos',
      tipo: 'Herrero',
      ubicacion: 'Novigrado'
    });

    expect(response.status).toBe(201);
    expect(response.body.nombre).toBe('Carlos');
    expect(response.body.tipo).toBe('Herrero');
    expect(response.body.ubicacion).toBe('Novigrado');

    // Eliminar el mercader creado
    await request(app).delete(`/merchants?nombre=Carlos`);
  });

  test('POST /merchants - Crear mercader duplicado', async () => {
    const response = await request(app).post('/merchants').send({
      nombre: 'Hattori',
      tipo: 'Herrero',
      ubicacion: 'Novigrado'
    });
    expect(response.status).toBe(400);
    expect(response.text).toBe('Ya existe un mercader con el mismo nombre');
  });
});



describe('Peticiones GET para los mercaderes', () => {
  test('GET /merchants - Obtener todos los mercaderes, existiendo 2', async () => {
    await request(app).post('/merchants').send({
      nombre: 'Eibhear Hattori',
      tipo: 'Armero',
      ubicacion: 'Novigrado'
    });

    const response = await request(app).get('/merchants');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].nombre).toBe('Hattori');

    // Eliminar a los mercaderes
    await request(app).delete(`/merchants?nombre=Eibhear%20Hattori`);
  });

  test('GET /merchants - Obtener el mercader buscándolo por su nombre', async () => {
    const response = await request(app).get('/merchants?nombre=Hattori');
    expect(response.status).toBe(200);
    expect(response.body.nombre).toBe('Hattori');
  });

  test('GET /merchants - Error al obtener los mercaderes por la inexistencia de estos', async () => {
    await request(app).delete(`/merchants?nombre=Hattori`);
    const response = await request(app).get('/merchants');
    expect(response.text).toBe('No existe mercader con ese nombre');
    expect(response.status).toBe(404);
  });

  test('GET /merchants - Obtener el mercader buscándolo por ID', async () => {
    const test = await request(app).get('/merchants?nombre=Hattori');
    const response = await request(app).get('/merchants/' + test.body._id);
    expect(response.status).toBe(200);
    expect(response.body.nombre).toBe('Hattori');
  });

  test('GET /merchants - Error al obtener los mercaderes por su ID', async () => {
    const response = await request(app).get('/merchants/123');
    expect(response.status).toBe(500);
  });
});



describe('Peticiones PATCH para los mercaderes', () => {
  test('PATCH /merchants - Modificar mercader por nombre', async () => {
    const response = await request(app).patch('/merchants?nombre=Hattori').send({
      tipo: 'Alquimista'
    });
    expect(response.status).toBe(200);
    expect(response.body.nombre).toBe('Hattori');
    expect(response.body.tipo).toBe('Alquimista');
  });

  test('PATCH /merchants - Error al modificar mercader por nombre, no encuentra al mercader', async () => {
    const response = await request(app).patch('/merchants?nombre=prueba').send({
      tipo: 'Armero'
    });
    expect(response.status).toBe(400);
  });

  test('PATCH /merchants - Error al modificar mercader por nombre, no se envía body', async () => {
    const response = await request(app).patch('/merchants?nombre=Hattori');
    expect(response.status).toBe(400);
  });

  test('PATCH /merchants - Error al modificar mercader por nombre, campo no permitido', async () => {
    const response = await request(app).patch('/merchants?nombre=Hattori').send({
      edad: '40'
    });
    expect(response.status).toBe(400);
    expect(response.text).toBe('El cambio no está permitido');
  });

  test('PATCH /merchants - Error al modificar mercader por nombre, nombre erróneo', async () => {
    const response = await request(app).patch('/merchants?nombre=prueba').send({
      tipo: 'Armero'
    });
    expect(response.status).toBe(400);
  });

  test('PATCH /merchants - Modificar mercader por ID', async () => {
    const test = await request(app).get('/merchants?nombre=Hattori');
    const response = await request(app).patch('/merchants/' + test.body._id).send({
      tipo: 'Alquimista'
    });
    expect(response.status).toBe(200);
    expect(response.body.nombre).toBe('Hattori');
    expect(response.body.tipo).toBe('Alquimista');
  });

  test('PATCH /merchants - Error al modificar mercader por ID, no se envía body', async () => {
    const test = await request(app).get('/merchants?nombre=Hattori');
    const response = await request(app).patch('/merchants/' + test.body._id);
    expect(response.status).toBe(400);
    expect(response.text).toBe('Los campos a modificar deben ser proporcionados en el cuerpo de la solicitud');
  });

  test('PATCH /merchants - Error al modificar mercader por ID, no existe el mercader', async () => {
    const response = await request(app).patch('/merchants/123').send({
      tipo: 'Armero'
    });
    expect(response.status).toBe(400);
  });

  test('PATCH /merchants - Error al modificar mercader por ID, campo no permitido', async () => {
    const test = await request(app).get('/merchants?nombre=Hattori');
    const response = await request(app).patch('/merchants/' + test.body._id).send({
      edad: '40'
    });
    expect(response.status).toBe(400);
    expect(response.text).toBe('El cambio no está permitido');
  });
});

describe('Peticiones DELETE para los mercaderes', () => {
  test('DELETE /merchants - Eliminar mercader por nombre', async () => {
    const response = await request(app).delete('/merchants?nombre=Hattori');
    expect(response.status).toBe(200);
    expect(response.body.nombre).toBe('Hattori');
  });

  test('DELETE /merchants - Error al eliminar mercader por nombre, no existe el mercader', async () => {
    await request(app).delete('/merchants?nombre=Hattori');
    const response = await request(app).delete('/merchants?nombre=Hattori');
    expect(response.status).toBe(404);
    expect(response.text).toBe('No existe mercader con ese nombre');
  });

  test('DELETE /merchants - Eliminar mercader por ID', async () => {
    const test = await request(app).get('/merchants?nombre=Hattori');
    const response = await request(app).delete('/merchants/' + test.body._id);
    expect(response.status).toBe(200);
    expect(response.body.nombre).toBe('Hattori');
  });

  test('DELETE /merchants - Error al eliminar mercader por ID, no existe el mercader', async () => {
    const response = await request(app).delete('/merchants/123');
    expect(response.status).toBe(400);
  });
});
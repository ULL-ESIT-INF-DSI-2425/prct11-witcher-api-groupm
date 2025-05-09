import { describe, test, expect, beforeEach, afterEach } from "vitest";
import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../src/app.js';
import { Cazador } from "../src/models/Cazadores.js";

beforeEach(async () => {
  await request(app).post('/hunters').send({
    nombre: 'Geralt de Rivia',
    raza: 'Humano',
    ubicacion: 'Novigrado'
  });
});

afterEach(async () => {
  await request(app).delete('/hunters?nombre=Geralt%20de%20Rivia');
  if (mongoose.connection.readyState !== 0) {
    await Cazador.deleteMany({});
  }
});

describe('Peticiones POST para los cazadores', () => {
  test('POST /hunters - Crear cazador', async () => {
    const response = await request(app).post('/hunters').send({
      nombre: 'Carlos',
      raza: 'Humano',
      ubicacion: 'Novigrado'
    });
    expect(response.status).toBe(201);
    expect(response.body.nombre).toBe('Carlos');
    expect(response.body.raza).toBe('Humano');
    expect(response.body.ubicacion).toBe('Novigrado');

    // Eliminar el cazador creado
    await request(app).delete(`/hunters?nombre=Carlos`);
  });

  test('POST /hunters - Crear cazador duplicado', async () => {
    const response = await request(app).post('/hunters').send({
      nombre: 'Geralt de Rivia',
      raza: 'Humano',
      ubicacion: 'Novigrado'
    });
    expect(response.status).toBe(400);
    expect(response.text).toBe('Ya existe un cazador con el mismo nombre');
  });
});



describe('Peticiones GET para los cazadores', () => {
  test('GET /hunters - Obtener todos los cazadores, existiendo 2', async () => {
    await request(app).post('/hunters').send({
      nombre: 'Juan Magan',
      raza: 'Humano',
      ubicacion: 'Novigrado'
    });

    const response = await request(app).get('/hunters');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[0].nombre).toBe('Geralt de Rivia');
    expect(response.body[1].nombre).toBe('Juan Magan');

    // Eliminar a los cazadores
    await request(app).delete(`/hunters?nombre=Juan%20Magan`);
  });

  test('GET /hunters - Obtener el cazador buscandolo por su nombre', async () => {
    const response = await request(app).get('/hunters?nombre=Geralt%20de%20Rivia');
    expect(response.status).toBe(200);
    expect(response.body.nombre).toBe('Geralt de Rivia');
  });

  test('GET /hunters - Error al obtener los cazadores por la inexistencia de estos', async () => {
    await request(app).delete(`/hunters?nombre=Geralt%20de%20Rivia`);
    const response = await request(app).get('/hunters');
    expect(response.text).toBe('No existe cazador con ese nombre, o no existen cazadores');
    expect(response.status).toBe(404);
  });

  test('GET /hunters - Obtener el cazador buscandolo por ID', async () => {
    const test = await request(app).get('/hunters?nombre=Geralt%20de%20Rivia');
    const response = await request(app).get('/hunters/' + test.body._id);
    expect(response.status).toBe(200);
    expect(response.body.nombre).toBe('Geralt de Rivia');
  });

  test('GET /hunters - Error al obtener los cazadores por su ID', async () => {
    const response = await request(app).get('/hunters/123');
    expect(response.status).toBe(400);
  });
});



describe('Peticiones PATCH para los cazadores', () => {
  test('PATCH /hunters - Modificar cazador por nombre', async () => {
    const response = await request(app).patch('/hunters?nombre=Geralt%20de%20Rivia').send({
      raza: 'Elfo'
    });
    expect(response.status).toBe(200);
    expect(response.body.nombre).toBe('Geralt de Rivia');
    expect(response.body.raza).toBe('Elfo');
  });

  test('PATCH /hunters - Error al modificar cazador por nombre, no encuentra al cazador', async () => {
    await request(app).delete(`/hunters?nombre=Geralt%20de%20Rivia`);
    const response = await request(app).patch('/hunters?nombre=Geralt%20de%20Rivia').send({
      raza: 'Mutante'
    });
    expect(response.status).toBe(400);
  });

  test('PATCH /hunters - Error al modificar cazador por nombre, no se envia body', async () => {
    const response = await request(app).patch('/hunters?nombre=Geralt%20de%20Rivia')
    expect(response.status).toBe(400);
  });

  test('PATCH /hunters - Error al modificar cazador por su nombre, campo no permitido', async () => {
    const response = await request(app).patch('/hunters?nombre=Geralt%20de%20Rivia').send({
      edad: 'Elfo'
    });
    expect(response.status).toBe(400);
    expect(response.text).toBe('El cambio no esta permitido');
  });

  test('PATCH /hunters - Error al modificar cazador por su nombre, nombre erroneo', async () => {
    const response = await request(app).patch('/hunters?nombre=prueba').send({
      raza: 'Elfo'
    });
    expect(response.status).toBe(404);
    expect(response.text).toBe('No existe cazador con ese nombre');
  });

  test('PATCH /hunters - Modificar cazador por ID', async () => {
    const test = await request(app).get('/hunters?nombre=Geralt%20de%20Rivia');
    const response = await request(app).patch('/hunters/' + test.body._id).send({
      raza: 'Elfo'
    });
    expect(response.status).toBe(200);
    expect(response.body.nombre).toBe('Geralt de Rivia');
    expect(response.body.raza).toBe('Elfo');
  });

  test('PATCH /hunters - Error al modificar cazador por ID, no se envia body', async () => {
    const test = await request(app).get('/hunters?nombre=Geralt%20de%20Rivia');
    const response = await request(app).patch('/hunters/' + test.body._id);
    expect(response.status).toBe(400);
    expect(response.text).toBe('Los campos a modificar deben ser proporcionados en el cuerpo de la solicitud');
  });

  test('PATCH /hunters - Error al modificar cazador por ID, no existe el cazador', async () => {
    const response = await request(app).patch('/hunters/123').send({
      raza: 'Elfo'
    });
    expect(response.status).toBe(400);
  });

  test('PATCH /hunters - Error al modificar cazador por ID, campo no permitido', async () => {
    const test = await request(app).get('/hunters?nombre=Geralt%20de%20Rivia');
    const response = await request(app).patch('/hunters/' + test.body._id).send({
      edad: 'Elfo'
    });
    expect(response.status).toBe(400);
    expect(response.text).toBe('El cambio no está permitido');
  });
});



describe('Peticiones DELETE para los cazadores', () => {
  test('DELETE /hunters - Eliminar cazador por nombre', async () => {
    const response = await request(app).delete('/hunters?nombre=Geralt%20de%20Rivia');
    expect(response.status).toBe(200);
    expect(response.body.nombre).toBe('Geralt de Rivia');
  });

  test('DELETE /hunters - Error al eliminar cazador por nombre, no existe el cazador', async () => {
    const response = await request(app).delete('/hunters?nombre=prueba');
    expect(response.status).toBe(404);
    expect(response.text).toBe('No existe cazador con ese nombre');
  });

  test('DELETE /hunters - Eliminar cazador por ID', async () => {
    const test = await request(app).get('/hunters?nombre=Geralt%20de%20Rivia');
    const response = await request(app).delete('/hunters/' + test.body._id);
    expect(response.status).toBe(200);
    expect(response.body.nombre).toBe('Geralt de Rivia');
  });

  test('DELETE /hunters - Error al eliminar cazador por ID, no existe el cazador', async () => {
    const response = await request(app).delete('/hunters/123');
    expect(response.status).toBe(400);
  });
});
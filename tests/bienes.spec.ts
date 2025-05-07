import { describe, test, expect, beforeEach, afterEach } from "vitest";
import request from 'supertest';
import { app } from '../src/app.js';


beforeEach(async () => {
  await request(app).post('/goods').send({
    nombre: 'casco',
    descripcion: 'descripcion',
    material: 'Acero de Mahakam',
    peso: 1,
    valor: 100,
    stock: 10
  });
});

afterEach(async () => {
  await request(app).delete('/goods?nombre=casco');
});

describe('Peticiones POST para los bienes', () => {

  test('POST /goods - Crear bien', async () => {
    const response = await request(app).post('/goods').send({
      nombre: 'pala',
      descripcion: 'descripcion de pala',
      material: 'Acero de Mahakam',
      peso: 1,
      valor: 100,
      stock: 10
    });

    expect(response.status).toBe(201);
    expect(response.body.nombre).toBe('pala');
    expect(response.body.descripcion).toBe('descripcion de pala');
    expect(response.body.material).toBe('Acero de Mahakam');
    expect(response.body.peso).toBe(1);
    expect(response.body.valor).toBe(100);
    expect(response.body.stock).toBe(10);

    await request(app).delete('/goods?nombre=pala');
  });

  test('POST /goods - Crear bien duplicado por nombre', async () => {
    const response = await request(app).post('/goods').send({
      nombre: 'casco',
      descripcion: 'descripcion distinta',
      material: 'Acero de Mahakam',
      peso: 1,
      valor: 100,
      stock: 10
    });

    expect(response.status).toBe(400);
    expect(response.text).toBe('Ya existe un bien con el mismo nombre o descripción');
  });

  test('POST /goods - Crear bien duplicado por descripción', async () => {
    const response = await request(app).post('/goods').send({
      nombre: 'pala',
      descripcion: 'descripcion',
      material: 'Acero de Mahakam',
      peso: 1,
      valor: 100,
      stock: 10
    });
    expect(response.status).toBe(400);
    expect(response.text).toBe('Ya existe un bien con el mismo nombre o descripción');
  });

  test('POST /goods - Crear bien duplicado por nombre y descripción', async () => {
    const response = await request(app).post('/goods').send({
      nombre: 'casco',
      descripcion: 'descripcion',
      material: 'Acero de Mahakam',
      peso: 1,
      valor: 100,
      stock: 10
    });
    expect(response.status).toBe(400);
    expect(response.text).toBe('Ya existe un bien con el mismo nombre o descripción');
  });
});

describe('Peticiones GET para los bienes', () => {
  test('GET /goods - Obtener todos los bienes, existiendo 2', async () => {
    await request(app).post('/goods').send({
      nombre: 'pala',
      descripcion: 'descripcion distinta',
      material: 'Acero de Mahakam',
      peso: 1,
      valor: 100,
      stock: 10
    });

    const response = await request(app).get('/goods');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[0].nombre).toBe('casco');
    expect(response.body[1].nombre).toBe('pala');

    // Eliminar a los bienes
    await request(app).delete(`/goods?nombre=pala`);
  });

  test('GET /goods - Obtener el bien buscandolo por su nombre', async () => {
    const response = await request(app).get('/goods?nombre=casco');
    expect(response.status).toBe(200);
  });

  test('GET /goods - Obtener el bien buscandolo por su descripcion', async () => {
    const response = await request(app).get('/goods?descrpcion=descripcion');
    expect(response.status).toBe(200);
    expect(response.body[0].nombre).toBe('casco');
  });

  test('GET /goods - Obtener el bien buscandolo por su nombre y descripción', async () => {
    const response = await request(app).get('/goods?nombre=casco&descripcion=descripcion');
    expect(response.status).toBe(200);
    expect(response.body[0].nombre).toBe('casco');
  });

  test('GET /goods - Error al obtener los bienes por la inexistencia de estos', async () => {
    await request(app).delete('/goods?nombre=casco');
    const response = await request(app).get('/goods');
    expect(response.status).toBe(404);
    expect(response.text).toBe('No existe ningún bien con el campo especificado, o no existe ningún bien');
  });

  test('GET /goods - Obtener el bien buscandolo por ID', async () => {
    await request(app).post('/goods').send({
      nombre: 'espada',
      descripcion: 'espada',
      material: 'Acero de Mahakam',
      peso: 1,
      valor: 100,
      stock: 10
    });
    const test = await request(app).get('/goods?nombre=espada');

    const response = await request(app).get('/goods/' + test.body[0]._id);
    expect(response.status).toBe(200);
    expect(response.body.nombre).toBe('espada');

    // Eliminar el bien creado
    await request(app).delete(`/goods?nombre=espada`);
  });

  test('GET /goods - Error al obtener los bienes por su ID', async () => {
    const response = await request(app).get('/goods/123');
    expect(response.status).toBe(400);
  });
});



describe('Peticiones PATCH para los bienes', () => {
  test('PATCH /goods - Modificar bien por nombre', async () => {
    const response = await request(app).patch('/goods?nombre=casco').send({
      valor: 15
    });
    expect(response.status).toBe(200);
    expect(response.body.nombre).toBe('casco');
    expect(response.body.valor).toBe(15);
  });

  test('PATCH /goods - Error al modificar bien por nombre, no encuentra al bien', async () => {
    const response = await request(app).patch('/goods?nombre=casco').send({
      raza: 'Mutante'
    });
    expect(response.status).toBe(400);
  });

  test('PATCH /goods - Error al modificar bien por nombre, no se envia body', async () => {
    const response = await request(app).patch('/goods?nombre=casco')
    expect(response.status).toBe(400);
  });

  test('PATCH /goods - Error al modificar bien por su nombre, campo no permitido', async () => {
    const response = await request(app).patch('/goods?nombre=casco').send({
      edad: 'Elfo'
    });
    expect(response.status).toBe(400);
    expect(response.text).toBe('El cambio no esta permitido');
  });

  test('PATCH /goods - Error al modificar bien por su nombre y descripción, nombre y descripcion erroneo', async () => {
    const response = await request(app).patch('/goods?nombre=petroleo&descripcion=loquesea').send({
      valor: 15
    });
    expect(response.status).toBe(404);
    expect(response.text).toBe('No existe bien con ese nombre o descripcion');
  });

  test('PATCH /goods - Modificar bien por ID', async () => {
    const test = await request(app).get('/goods?nombre=casco');
    const response = await request(app).patch('/goods/' + test.body[0]._id).send({
      valor: 15
    });
    expect(response.status).toBe(200);
    expect(response.body.nombre).toBe('casco');
    expect(response.body.valor).toBe(15);
  });

  test('PATCH /goods - Error al modificar bien por ID, no se envia body', async () => {
    const test = await request(app).get('/goods?nombre=casco');
    const response = await request(app).patch('/goods/' + test.body[0]._id);
    expect(response.status).toBe(400);
    expect(response.text).toBe('Los campos a modificar deben ser proporcionados en el cuerpo de la solicitud');
  });

  test('PATCH /goods - Error al modificar bien por ID, no existe el bien', async () => {
    const response = await request(app).patch('/goods/123').send({
      raza: 'Elfo'
    });
    expect(response.status).toBe(400);
  });

  test('PATCH /goods - Error al modificar bien por ID, campo no permitido', async () => {
    const test = await request(app).get('/goods?nombre=casco');
    const response = await request(app).patch('/goods/' + test.body[0]._id).send({
      edad: 'Elfo'
    });
    expect(response.status).toBe(400);
    expect(response.text).toBe('El cambio no está permitido');
  });
});



describe('Peticiones DELETE para los bienes', () => {
  test('DELETE /goods - Eliminar bien por nombre', async () => {
    const response = await request(app).delete('/goods?nombre=casco');
    expect(response.status).toBe(200);
    expect(response.body.nombre).toBe('casco');
  });

  test('DELETE /goods - Error al eliminar bien por nombre y descripción, no existe el bien', async () => {
    const response = await request(app).delete('/goods?nombre=petroleo&descripcion=loquesea');
    expect(response.status).toBe(404);
    expect(response.text).toBe('No existe bien con ese nombre o descripcion');
  });

  test('DELETE /goods - Eliminar bien por ID', async () => {
    const test = await request(app).get('/goods?nombre=casco');
    const response = await request(app).delete('/goods/' + test.body[0]._id);
    expect(response.status).toBe(200);
    expect(response.body.nombre).toBe('casco');
  });

  test('DELETE /goods - Error al eliminar bien por ID, no existe el bien', async () => {
    const response = await request(app).delete('/goods/123');
    expect(response.status).toBe(400);
  });
});
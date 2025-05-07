import { describe, test, expect } from "vitest";
import request from 'supertest';
import { app } from '../src/app.js';



describe('Peticiones POST para los bienes', () => {
  test('POST /goods - Crear bien', async () => {
    const response = await request(app).post('/goods').send({
      nombre: 'casco',
      descripcion: 'descripcion',
      material: 'Acero de Mahakam',
      peso: 1,
      valor: 100,
      stock: 10
    });
    expect(response.status).toBe(201);
    expect(response.body.nombre).toBe('casco');
    expect(response.body.descripcion).toBe('descripcion');
    expect(response.body.material).toBe('Acero de Mahakam');
    expect(response.body.peso).toBe(1);
    expect(response.body.valor).toBe(100);
    expect(response.body.stock).toBe(10);

    // Eliminar el bien creado
    await request(app).delete(`/goods?nombre=casco`);
  });

  test('POST /goods - Crear bien duplicado por nombre', async () => {
    await request(app).post('/goods').send({
      nombre: 'casco',
      descripcion: 'descripcion',
      material: 'Acero de Mahakam',
      peso: 1,
      valor: 100,
      stock: 10
    });

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

    // Eliminar el bien creado
    await request(app).delete(`/goods?nombre=casco`);
  });

  test('POST /goods - Crear bien duplicado por descripción', async () => {
    await request(app).post('/goods').send({
      nombre: 'casco',
      descripcion: 'descripcion',
      material: 'Acero de Mahakam',
      peso: 1,
      valor: 100,
      stock: 10
    });

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

    // Eliminar el bien creado
    await request(app).delete(`/goods?nombre=casco`);
  });

  test('POST /goods - Crear bien duplicado por nombre y descripción', async () => {
    await request(app).post('/goods').send({
      nombre: 'casco',
      descripcion: 'descripcion',
      material: 'Acero de Mahakam',
      peso: 1,
      valor: 100,
      stock: 10
    });

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

    // Eliminar el bien creado
    await request(app).delete(`/goods?nombre=casco`);
  });
});



describe('Peticiones GET para los bienes', () => {
  test('GET /goods - Obtener todos los bienes, existiendo 2', async () => {
    await request(app).post('/goods').send({
      nombre: 'casco',
      descripcion: 'descripcion',
      material: 'Acero de Mahakam',
      peso: 1,
      valor: 100,
      stock: 10
    });

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
    await request(app).delete(`/goods?nombre=casco`);
    await request(app).delete(`/goods?nombre=pala`);
  });

  test('GET /goods - Obtener el bien buscandolo por su nombre', async () => {
    await request(app).post('/goods').send({
      nombre: 'pala',
      descripcion: 'descripcion',
      material: 'Acero de Mahakam',
      peso: 1,
      valor: 100,
      stock: 10
    });

    const response = await request(app).get('/goods?nombre=pala');
    expect(response.status).toBe(200);

    // Eliminar al bien
    await request(app).delete(`/goods?nombre=pala`);
  });

  test('GET /goods - Obtener el bien buscandolo por su descripcion', async () => {
    await request(app).post('/goods').send({
      nombre: 'pala',
      descripcion: 'descripcion',
      material: 'Acero de Mahakam',
      peso: 1,
      valor: 100,
      stock: 10
    });

    const response = await request(app).get('/goods?descrpcion=descripcion');
    expect(response.status).toBe(200);
    expect(response.body.nombre).toBe('pala');

    // Eliminar al bien
    await request(app).delete(`/goods?nombre=pala`);
  });

  test('GET /goods - Obtener el bien buscandolo por su nombre y descripción', async () => {
    await request(app).post('/goods').send({
      nombre: 'pala',
      descripcion: 'descripcion',
      material: 'Acero de Mahakam',
      peso: 1,
      valor: 100,
      stock: 10
    });

    const response = await request(app).get('/goods?nombre=pala&descripcion=descripcion');
    expect(response.status).toBe(200);
    expect(response.body.nombre).toBe('pala');

    // Eliminar al bien
    await request(app).delete(`/goods?nombre=pala`);
  });

  test('GET /goods - Error al obtener los bienes por la inexistencia de estos', async () => {
    const response = await request(app).get('/goods');
    expect(response.text).toBe('No existe bien con ese nombre, o no existen bienes');
    expect(response.status).toBe(404);
  });

  test('GET /goods - Obtener el bien buscandolo por ID', async () => {
    await request(app).post('/goods').send({
      nombre: 'pala',
      descripcion: 'descripcion',
      material: 'Acero de Mahakam',
      peso: 1,
      valor: 100,
      stock: 10
    });
    const test = await request(app).get('/goods?nombre=pala');
    const ID = test.body._id;

    const response = await request(app).get('/goods/' + ID);
    expect(response.status).toBe(200);
    expect(response.body.nombre).toBe('pala');

    // Eliminar al bien
    await request(app).delete(`/goods?nombre=pala`);
  });

  test('GET /goods - Error al obtener los bienes por su ID', async () => {
    const response = await request(app).get('/goods/123');
    expect(response.status).toBe(500);
  });
});



// describe('Peticiones PATCH para los bienes', () => {
//   test('PATCH /goods - Modificar bien por nombre', async () => {
//     await request(app).post('/goods').send({
//       nombre: 'casco',
//       descripcion: 'descripcion',
//       material: 'Acero de Mahakam',
//       peso: 1,
//       valor: 100,
//       stock: 10
//     });

//     const response = await request(app).patch('/goods?nombre=casco').send({
//       raza: 'Elfo'
//     });
//     expect(response.status).toBe(200);
//     expect(response.body.nombre).toBe('casco');
//     expect(response.body.raza).toBe('Elfo');

//     // Eliminar el bien creado
//     await request(app).delete(`/goods?nombre=casco`);
//   });

//   test('PATCH /goods - Error al modificar bien por nombre, no encuentra al bien', async () => {
//     const response = await request(app).patch('/goods?nombre=casco').send({
//       raza: 'Mutante'
//     });
//     expect(response.status).toBe(400);
//   });

//   test('PATCH /goods - Error al modificar bien por nombre, no se envia body', async () => {
//     await request(app).post('/goods').send({
//       nombre: 'casco',
//       descripcion: 'descripcion',
//       material: 'Acero de Mahakam',
//       peso: 1,
//       valor: 100,
//       stock: 10
//     });

//     const response = await request(app).patch('/goods?nombre=casco')
//     expect(response.status).toBe(400);

//     // Eliminar el bien creado
//     await request(app).delete(`/goods?nombre=casco`);
//   });

//   test('PATCH /goods - Error al modificar bien por su nombre, campo no permitido', async () => {
//     await request(app).post('/goods').send({
//       nombre: 'casco',
//       descripcion: 'descripcion',
//       material: 'Acero de Mahakam',
//       peso: 1,
//       valor: 100,
//       stock: 10
//     });

//     const response = await request(app).patch('/goods?nombre=casco').send({
//       edad: 'Elfo'
//     });
//     expect(response.status).toBe(400);
//     expect(response.text).toBe('El cambio no esta permitido');

//     // Eliminar el bien creado
//     await request(app).delete(`/goods?nombre=casco`);
//   });

//   test('PATCH /goods - Error al modificar bien por su nombre, nombre erroneo', async () => {
//     await request(app).post('/goods').send({
//       nombre: 'casco',
//       descripcion: 'descripcion',
//       material: 'Acero de Mahakam',
//       peso: 1,
//       valor: 100,
//       stock: 10
//     });

//     const response = await request(app).patch('/goods?nombre=cascodor').send({
//       raza: 'Elfo'
//     });
//     expect(response.status).toBe(404);
//     expect(response.text).toBe('No existe bien con ese nombre');

//     // Eliminar el bien creado
//     await request(app).delete(`/goods?nombre=casco`);
//   });

//   test('PATCH /goods - Modificar bien por ID', async () => {
//     await request(app).post('/goods').send({
//       nombre: 'casco',
//       descripcion: 'descripcion',
//       material: 'Acero de Mahakam',
//       peso: 1,
//       valor: 100,
//       stock: 10
//     });
//     const test = await request(app).get('/goods?nombre=casco');
//     const ID = test.body._id;

//     const response = await request(app).patch('/goods/' + ID).send({
//       raza: 'Elfo'
//     });
//     expect(response.status).toBe(200);
//     expect(response.body.nombre).toBe('casco');
//     expect(response.body.raza).toBe('Elfo');

//     // Eliminar el bien creado
//     await request(app).delete(`/goods?nombre=casco`);
//   });

//   test('PATCH /goods - Error al modificar bien por ID, no se envia body', async () => {
//     const response = await request(app).patch('/goods/123');
//     expect(response.status).toBe(400);
//   });

//   test('PATCH /goods - Error al modificar bien por ID, no existe el bien', async () => {
//     const response = await request(app).patch('/goods/123').send({
//       raza: 'Elfo'
//     });
//     expect(response.status).toBe(400);
//   });

//   test('PATCH /goods - Error al modificar bien por ID, campo no permitido', async () => {
//     await request(app).post('/goods').send({
//       nombre: 'casco',
//       descripcion: 'descripcion',
//       material: 'Acero de Mahakam',
//       peso: 1,
//       valor: 100,
//       stock: 10
//     });
//     const test = await request(app).get('/goods?nombre=casco');
//     const ID = test.body._id;

//     const response = await request(app).patch('/goods/' + ID).send({
//       edad: 'Elfo'
//     });
//     expect(response.status).toBe(400);
//     expect(response.text).toBe('El cambio no está permitido');

//     // Eliminar el bien creado
//     await request(app).delete(`/goods?nombre=casco`);
//   });
// });



// describe('Peticiones DELETE para los bienes', () => {
//   test('DELETE /goods - Eliminar bien por nombre', async () => {
//     await request(app).post('/goods').send({
//       nombre: 'casco',
//       descripcion: 'descripcion',
//       material: 'Acero de Mahakam',
//       peso: 1,
//       valor: 100,
//       stock: 10
//     });

//     const response = await request(app).delete('/goods?nombre=casco');
//     expect(response.status).toBe(200);
//     expect(response.body.nombre).toBe('casco');
//   });

//   test('DELETE /goods - Error al eliminar bien por nombre, no existe el bien', async () => {
//     const response = await request(app).delete('/goods?nombre=casco');
//     expect(response.status).toBe(404);
//     expect(response.text).toBe('No existe bien con ese nombre');
//   });

//   test('DELETE /goods - Eliminar bien por ID', async () => {
//     await request(app).post('/goods').send({
//       nombre: 'casco',
//       descripcion: 'descripcion',
//       material: 'Acero de Mahakam',
//       peso: 1,
//       valor: 100,
//       stock: 10
//     });
//     const test = await request(app).get('/goods?nombre=casco');
//     const ID = test.body._id;

//     const response = await request(app).delete('/goods/' + ID);
//     expect(response.status).toBe(200);
//     expect(response.body.nombre).toBe('casco');
//   });

//   test('DELETE /goods - Error al eliminar bien por ID, no existe el bien', async () => {
//     const response = await request(app).delete('/goods/123');
//     expect(response.status).toBe(400);
//   });
// });
import { describe, test, expect, beforeEach, afterEach } from "vitest";
import request from 'supertest';
import { app } from '../src/app.js';
import { Transaccion } from "../src/models/Transaccion.js";
import { Cazador } from "../src/models/Cazadores.js";
import { Mercader } from "../src/models/Mercaderes.js";
import { Bien } from "../src/models/Bienes.js";

let nuevoCazador;
let nuevoMercader;
let nuevoBien;

const cazadorData = {
  nombre: "Jose",
  raza: "Humano",
  ubicacion: "Velen",
};

const mercaderData = {
  nombre: "Pablo",
  tipo: "Herrero",
  ubicacion: "Velen",
};

const bienData = {
  nombre: "Espada",
  descripcion: "Espada forjada para cazar monstruos",
  material: "Acero de Mahakam",
  peso: 3.5,
  valor: 1000,
  stock: 50,
};

beforeEach(async () => {
  await Cazador.deleteMany({ nombre: "Jose" });
  await Mercader.deleteMany({ nombre: "Pablo" });
  await Bien.deleteMany({ nombre: "Espada" });
  await Transaccion.deleteMany({});
  nuevoCazador = await new Cazador(cazadorData).save();
  nuevoMercader = await new Mercader(mercaderData).save();
  nuevoBien = await new Bien(bienData).save();
});

afterEach(async () => {
  await Cazador.deleteMany({ nombre: "Jose" });
  await Mercader.deleteMany({ nombre: "Pablo" });
  await Bien.deleteMany({ nombre: "Espada" });
  await Transaccion.deleteMany({});
});

describe('Peticiones POST para las trasacciones', () => {
  test('POST /transactions - Crear transacción con cazador', async () => {
    const response = await request(app).post('/transactions').send({
      "tipo": "Compra",
      "bienes": [
        {
          "nombre": "Espada",
          "descripcion": "Espada forjada para cazar monstruos",
          "material": "Acero de Mahakam",
          "peso": 3.5,
          "valor": 1500,
          "cantidad": 2
        }
      ],
      "personaTipo": "Cazador",
      "persona": `${nuevoCazador._id}`,
    });

    expect(response.status).toBe(201);
  });

  test('POST /transactions - Crear transacción con mercader', async () => {
    const response = await request(app).post('/transactions').send({
      "tipo": "Venta",
      "bienes": [
        {
          "nombre": "Espada",
          "descripcion": "Espada forjada para cazar monstruos",
          "material": "Acero de Mahakam",
          "peso": 3.5,
          "valor": 1500,
          "cantidad": 2
        }
      ],
      "personaTipo": "Mercader",
      "persona": `${nuevoMercader._id}`,
    });

    expect(response.status).toBe(201);
  });
  test('POST /transactions - Error al crear transacción, cazador no existe', async () => {
    const response = await request(app).post('/transactions').send({
      "tipo": "Compra",
      "bienes": [
        {
          "nombre": "Espada",
          "descripcion": "Espada forjada para cazar monstruos",
          "material": "Acero de Mahakam",
          "peso": 3.5,
          "valor": 1500,
          "cantidad": 2
        }
      ],
      "personaTipo": "Cazador",
      // "persona": `${nuevoCazador._id}123`,
    });

    expect(response.status).toBe(404);
    expect(response.text).toBe("{\"error\":\"Persona no encontrada\"}");
  });
  test('POST /transactions - Error al crear transacción, mercader no existe', async () => {       
    const response = await request(app).post('/transactions').send({
      "tipo": "Venta",
      "bienes": [
        {
          "nombre": "Espada",
          "descripcion": "Espada forjada para cazar monstruos",
          "material": "Acero de Mahakam",
          "peso": 3.5,
          "valor": 1500,
          "cantidad": 2
        }
      ],
      "personaTipo": "Mercader",
      // "persona": `${nuevoMercader._id}123`,
    });

    expect(response.status).toBe(404);
    expect(response.text).toBe("{\"error\":\"Persona no encontrada\"}");
  });
});



describe('Peticiones GET para las transacciones', () => {
  test('GET /transactions - Obtener todas las transacciones', async () => {
    const response = await request(app).get('/transactions');
    expect(response.status).toBe(200);
  });

  test('GET /transactions - Obtener transacción por ID', async () => {
    const transaccion = await new Transaccion({
      tipo: "Compra",
      bienes: [
        {
          nombre: "Espada",
          descripcion: "Espada forjada para cazar monstruos",
          material: "Acero de Mahakam",
          peso: 3.5,
          valor: 1500,
          cantidad: 2
        }
      ],
      personaTipo: "Cazador",
      persona: `${nuevoCazador._id}`,
    }).save();

    const response = await request(app).get(`/transactions/${transaccion._id}`);
    expect(response.status).toBe(200);
    expect(response.body._id).toBe(transaccion._id.toString());
  });

  test('GET /transactions - Error al obtener transacción por ID, no existe', async () => {
    const response = await request(app).get('/transactions/123');
    expect(response.status).toBe(404);
    expect(response.text).toBe("{\"error\":\"Transacción no encontrada\"}");
  });
});



describe('Peticiones PATCH para las transacciones', () => {
  // test('PATCH /transactions - Actualizar transacción por ID', async () => {
  //   const transaccion = await new Transaccion({
  //     tipo: "Compra",
  //     bienes: [
  //       {
  //         nombre: "Espada",
  //         descripcion: "Espada forjada para cazar monstruos",
  //         material: "Acero de Mahakam",
  //         peso: 3.5,
  //         valor: 1500,
  //         cantidad: 2
  //       }
  //     ],
  //     personaTipo: "Cazador",
  //     persona: `${nuevoCazador._id}`,
  //   }).save();

  //   const nuevoMercaderVenta = await new Mercader({
  //     nombre: "Hattori",
  //     tipo: "Herrero",
  //     ubicacion: "Novigrado",
  //   }).save();

  //   const response = await request(app).patch(`/transactions/${transaccion._id}`).send({
  //     tipo: "Venta",
  //     bienes: [
  //     {
  //       nombre: "Espada",
  //       descripcion: "Espada mejorada para cazar monstruos",
  //       material: "Acero de Mahakam refinado",
  //       peso: 3.0,
  //       valor: 2000,
  //       cantidad: 1
  //     }
  //     ],
  //     personaTipo: "Mercader",
  //     persona: `${nuevoMercaderVenta._id}`,
  //   });

  //   expect(response.status).toBe(200);
  //   expect(response.body.tipo).toBe("Venta");
  // });

  test('PATCH /transactions - Error al actualizar transacción, no existe', async () => {
    const response = await request(app).patch('/transactions/123').send({
      tipo: "Venta",
    });
    expect(response.status).toBe(404);
    expect(response.text).toBe("{\"error\":\"Transacción no encontrada\"}");
  });
});

describe('Peticiones DELETE para las transacciones', () => {
  test('DELETE /transactions - Eliminar transacción de compra por ID', async () => {
    const transaccion = await new Transaccion({
      tipo: "Compra",
      bienes: [
        {
          nombre: "Espada",
          descripcion: "Espada forjada para cazar monstruos",
          material: "Acero de Mahakam",
          peso: 3.5,
          valor: 1500,
          cantidad: 2
        }
      ],
      personaTipo: "Cazador",
      persona: `${nuevoCazador._id}`,
    }).save();

    const response = await request(app).delete(`/transactions/${transaccion._id}`);
    expect(response.status).toBe(200);
    expect(response.body.tipo).toBe("Compra");
    expect(response.body.bienes[0].nombre).toBe("Espada");
    expect(response.body.bienes[0].descripcion).toBe("Espada forjada para cazar monstruos");
    expect(response.body.bienes[0].material).toBe("Acero de Mahakam");
    expect(response.body.bienes[0].peso).toBe(3.5);
    expect(response.body.bienes[0].valor).toBe(1500);
    expect(response.body.bienes[0].cantidad).toBe(2);
    expect(response.body.personaTipo).toBe("Cazador");
    expect(response.body.persona).toBe(`${nuevoCazador._id}`);
  });

  test('DELETE /transactions - Eliminar transacción de venta por ID' , async () => {
    const transaccion = await new Transaccion({
      tipo: "Venta",
      bienes: [
        {
          nombre: "Espada",
          descripcion: "Espada forjada para cazar monstruos",
          material: "Acero de Mahakam",
          peso: 3.5,
          valor: 1500,
          cantidad: 2
        }
      ],
      personaTipo: "Mercader",
      persona: `${nuevoMercader._id}`,
    }).save();

    const response = await request(app).delete(`/transactions/${transaccion._id}`);
    expect(response.status).toBe(200);
    expect(response.body.tipo).toBe("Venta");
    expect(response.body.bienes[0].nombre).toBe("Espada");
    expect(response.body.bienes[0].descripcion).toBe("Espada forjada para cazar monstruos");
    expect(response.body.bienes[0].material).toBe("Acero de Mahakam");
    expect(response.body.bienes[0].peso).toBe(3.5);
    expect(response.body.bienes[0].valor).toBe(1500);
    expect(response.body.bienes[0].cantidad).toBe(2);
    expect(response.body.personaTipo).toBe("Mercader");
    expect(response.body.persona).toBe(`${nuevoMercader._id}`);
  });  

  test('DELETE /transactions - Error al eliminar transacción, no existe', async () => {
    const response = await request(app).delete('/transactions/123');
    expect(response.status).toBe(404);
    expect(response.text).toBe("{\"error\":\"Transacción no encontrada\"}");
  });

  test('DELETE /transactions - Error al eliminar transacción, ID inválido', async () => {
    const response = await request(app).delete('/transactions/IDejemplo');
    expect(response.status).toBe(404);
    expect(response.text).toBe("{\"error\":\"Transacción no encontrada\"}");
  });

  
});

import { describe, test, expect, afterEach, beforeEach } from "vitest";
import request from 'supertest';
import mongoose from 'mongoose';
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
  ubicacion: "Bosque Oscuro",
};

const mercaderData = {
  nombre: "Pablo",
  tipo: "Herrero",
  ubicacion: "Ciudadela",
};

const bienData = {
  nombre: "Espada de Plata",
  descripcion: "Espada forjada para cazar monstruos",
  material: "Acero de Mahakam",
  peso: 3.5,
  valor: 1000,
  stock: 50,
};

beforeEach(async () => {
  await Cazador.deleteMany({ nombre: "Jose" });
  await Mercader.deleteMany({ nombre: "Pablo" });
  await Bien.deleteMany({ nombre: "Espada de plata" });
  await Transaccion.deleteMany({});
  nuevoCazador = await new Cazador(cazadorData).save();
  nuevoMercader = await new Mercader(mercaderData).save();
  nuevoBien = await new Bien(bienData).save();
});

afterEach(async () => {
  
});

describe("Transacciones API", () => {

  test("POST /transacciones - Crear una nueva transacción", async () => {
    // const nuevaTransaccion = {
    //   tipo: "Compra",
    //   bienes: [
    //     {
    //       nombre: "Espada de acero",
    //       descripcion: "Espada forjada con acero de Mahakam",
    //       material: "Acero de Mahakam",
    //       peso: 3.5,
    //       valor: 150,
    //       cantidad: 2,
    //     },
    //   ],
    //   personaTipo: "Cazador",
    //   persona: new mongoose.Types.ObjectId(),
    // };

    const response = await request(app)
      .post("/transacciones")
      .send({
        tipo: "Compra",
          bienes: [
            {
              nombre: "Espada de acero",
              descripcion: "Espada forjada con acero de Mahakam",
              material: "Acero de Mahakam",
              peso: 3.5,
              valor: 150,
              cantidad: 2,
            },
          ],
          personaTipo: "Cazador",
          persona: new mongoose.Types.ObjectId(),}
        ).expect(201);

    // expect(response.status).toBe(201);
    // expect(response.body).toHaveProperty("_id");
    // expect(response.body.tipo).toBe(nuevaTransaccion.tipo);
    // expect(response.body.bienes.length).toBe(1);
  });

  // test("GET /transacciones/:id - Obtener una transacción por ID", async () => {
  //   const transaccion = await Transaccion.create({
  //     tipo: "Venta",
  //     bienes: [
  //       {
  //         nombre: "Armadura de cuero",
  //         descripcion: "Armadura hecha de cuero endurecido",
  //         material: "Cuero endurecido",
  //         peso: 10,
  //         valor: 300,
  //         cantidad: 1,
  //       },
  //     ],
  //     personaTipo: "Mercader",
  //     persona: new mongoose.Types.ObjectId(),
  //   });

  //   const response = await request(app).get(`/transacciones/${transaccion._id}`);

  //   expect(response.status).toBe(200);
  //   expect(response.body).toHaveProperty("_id", transaccion._id.toString());
  //   expect(response.body.tipo).toBe(transaccion.tipo);
  // });

  // test("PATCH /transacciones/:id - Actualizar una transacción", async () => {
  //   const transaccion = await Transaccion.create({
  //     tipo: "Compra",
  //     bienes: [
  //       {
  //         nombre: "Poción mágica",
  //         descripcion: "Poción hecha con esencia mágica",
  //         material: "Esencia mágica",
  //         peso: 0.5,
  //         valor: 50,
  //         cantidad: 5,
  //       },
  //     ],
  //     personaTipo: "Cazador",
  //     persona: new mongoose.Types.ObjectId(),
  //   });

  //   const actualizacion = {
  //     bienes: [
  //       {
  //         nombre: "Poción mágica",
  //         descripcion: "Poción mejorada con esencia mágica",
  //         material: "Esencia mágica",
  //         peso: 0.5,
  //         valor: 60,
  //         cantidad: 6,
  //       },
  //     ],
  //   };

  //   const response = await request(app)
  //     .patch(`/transacciones/${transaccion._id}`)
  //     .send(actualizacion);

  //   expect(response.status).toBe(200);
  //   expect(response.body.bienes[0].valor).toBe(60);
  //   expect(response.body.bienes[0].cantidad).toBe(6);
  // });

  // test("DELETE /transacciones/:id - Eliminar una transacción", async () => {
  //   const transaccion = await Transaccion.create({
  //     tipo: "Venta",
  //     bienes: [
  //       {
  //         nombre: "Mutágeno antiguo",
  //         descripcion: "Mutágeno de bestias antiguas",
  //         material: "Mutágenos de bestias antiguas",
  //         peso: 1.2,
  //         valor: 500,
  //         cantidad: 1,
  //       },
  //     ],
  //     personaTipo: "Mercader",
  //     persona: new mongoose.Types.ObjectId(),
  //   });

  //   const response = await request(app).delete(`/transacciones/${transaccion._id}`);

  //   expect(response.status).toBe(200);
  //   const transaccionEliminada = await Transaccion.findById(transaccion._id);
  //   expect(transaccionEliminada).toBeNull();
  // });
});

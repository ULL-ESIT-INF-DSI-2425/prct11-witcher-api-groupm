import express from 'express';
import { Cazador } from '../models/Cazadores.js';
import { Mercader } from '../models/Mercaderes.js';
import { Bien } from '../models/Bienes.js';
import { Types } from 'mongoose';
import { Transaccion } from '../models/Transaccion.js';

export const routerTransaccion = express.Router();

async function updateStock(tipo: "Compra" | "Venta" | "DCompra" | "DVenta", bienes: any[]) {
  const resultado: Array<{ bien: Types.ObjectId; cantidad: number; costo_unidad: number }> = [];
  // para cada bien obtener los datos
  for (const item of bienes) {
    const { nombre, cantidad } = item;
    // Comprobar que existe
    let bien = await Bien.findOne({ nombre });
    if (tipo === "Compra" || tipo === "DVenta") {
      if (!bien) {
        throw new Error(`Bien "${nombre}" no encontrado en el inventario.`);
      }
      if (bien.stock < cantidad) {
        throw new Error(`Stock insuficiente para "${nombre}". Quedan ${bien.stock} unidades.`);
      }
      bien.stock -= cantidad;

      // if (bien.stock <= 0) {
      //   await Bien.deleteOne({ _id: bien._id });
      // } else {
        await bien.save();
      //}
      resultado.push({ bien: bien._id as Types.ObjectId, cantidad, costo_unidad: bien!.valor });
    }
    else if (tipo === "Venta" || tipo === "DCompra") {
      if (!bien) {
        // Creamos un nuevo bien con valores por defecto excepto nombre
        bien = new Bien({
          nombre,
          descripcion: item.descripcion,
          material: item.material,
          peso: item.peso,
          valor: item.valor,
          stock: cantidad,
        });
      } 
      else {
        bien.stock += cantidad;
      }

      await bien.save();
      resultado.push({ bien: bien._id as Types.ObjectId, cantidad, costo_unidad: bien.valor });
    }
  }
  return resultado;
  // Actualizar elemento de bien
}

function sumarMonto(items: { 
  bien: Types.ObjectId; 
  cantidad: number; 
  costo_unidad: number; 
}[]): number {
  // Function implementation goes here
  return items.reduce((total, item) => total + item.cantidad * item.costo_unidad, 0);
}

routerTransaccion.post("/", async (req, res) => {
  try {
    const persona = req.body.persona
    const busqueda = req.body.tipo === "Compra" ? await Cazador.findOne({persona}) : await Mercader.findOne({persona})
    if (!persona) {
      res.status(404).send({ error: 'Persona no encontrada' });
    }

    const {tipo, bienes, personaTipo} = req.body
    const items = await updateStock(tipo, bienes);
    const monto_total = sumarMonto(items);

    const transaccion = new Transaccion({
      tipo: tipo,
      bienes: bienes,
      personaTipo: personaTipo,
      persona: persona,
      monto: monto_total
    })
    await transaccion.save()
    res.status(201).send(transaccion)
  }
  catch(err) {
    res.status(500).send(err);
  }
})

routerTransaccion.delete("/:id", async (req, res) => {
  try {
    const transaccion = await Transaccion.findById(req.params.id)
    if (!transaccion) {
      res.status(404).send({ error: 'Transaccion no encontrada' });
    }
    const bienes = transaccion?.bienes
    if (transaccion!.tipo === "Compra") {
      const items = await updateStock("DCompra", bienes!);
      const transaccion_aux = await Transaccion.findByIdAndDelete(req.params.id)
      res.status(200).send(transaccion_aux);
    }
    else if (transaccion!.tipo === "Venta") {
      const items = await updateStock("DVenta", bienes!);
      const transaccion_aux = await Transaccion.findByIdAndDelete(req.params.id)
      res.status(200).send(transaccion_aux);
    }
  }
  catch(error) {
    res.status(500).send(error);
  }
})
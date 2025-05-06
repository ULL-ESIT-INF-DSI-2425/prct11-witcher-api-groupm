import express from 'express';
import { Cazador } from '../models/Cazadores.js';
import { Mercader } from '../models/Mercaderes.js';
import { Bien } from '../models/Bienes.js';
import { Types } from 'mongoose';

export const routerTransaccion = express.Router();

interface BienTransaccion {
  nombre: string;
  cantidad: number;
}

async function updateStock(tipo: "Compra" | "Venta", bienes: BienTransaccion[]) {
  const resultado: Array<{ bien: Types.ObjectId; cantidad: number; costo_unidad: number }> = [];

  for (const item of bienes) {
    const { nombre, cantidad } = item;
    let bien = await Bien.findOne({ nombre });

    if (tipo === "Compra") {
      if (!bien) {
        throw { status: 400, message: `Bien "${nombre}" no encontrado en el inventario.` };
      }
      if (bien.stock < cantidad) {
        throw { status: 400, message: `Stock insuficiente para "${nombre}". Quedan ${bien.stock} unidades.` };
      }
      bien.stock -= cantidad;

      if (bien.stock <= 0) {
        await Bien.deleteOne({ _id: bien._id });
      } else {
        await bien.save();
      }

      resultado.push({ bien: bien._id, cantidad, costo_unidad: bien.valor });
    }

    else if (tipo === "Venta") {
      if (!bien) {
        // Creamos un nuevo bien con valores por defecto excepto nombre
        bien = new Bien({
          nombre,
          descripcion: 'Bien creado por venta.',
          material: 'Acero de Mahakam',
          peso: 1,
          valor: 100,
          stock: cantidad,
        });
      } else {
        bien.stock += cantidad;
      }

      await bien.save();
      resultado.push({ bien: bien._id, cantidad, costo_unidad: bien.valor });
    }
  }

  return resultado;
}

routerTransaccion.post("/transactions", async (req, res) => {
  const persona = req.body.persona
  const busqueda = req.body.tipo === "Compra" ? await Cazador.findOne({persona}) : await Mercader.findOne({persona})
  if (!persona) {
    res.status(404).send({ error: 'Persona no encontrada' });
  }


})
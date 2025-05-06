import express from 'express';
import { Cazador } from '../models/Cazadores.js';
import { Mercader } from '../models/Mercaderes.js';
import { Bien } from '../models/Bienes.js';
import { Types } from 'mongoose';
import { Transaccion } from '../models/Transaccion.js';

export const routerTransaccion = express.Router();

async function updateStock(tipo: "Compra" | "Venta", bienes: any[]) {
  const resultado: Array<{ bien: Types.ObjectId; cantidad: number; costo_unidad: number }> = [];
  // para cada bien obtener los datos
  for (const item of bienes) {
    const { nombre, cantidad } = item;
    // Comprobar que existe
    let bien = await Bien.findOne({ nombre });
    if (tipo == "Compra") {
      if (!bien) {
        throw { status: 400, message: `Bien "${nombre}" no encontrado en el inventario.` };
      }
      if (bien.stock < cantidad) {
        throw { status: 400, message: `Stock insuficiente para "${nombre}". Quedan ${bien.stock} unidades.` };
      }
      bien.stock -= cantidad;

      // if (bien.stock <= 0) {
      //   await Bien.deleteOne({ _id: bien._id });
      // } else {
        await bien.save();
      //}
      resultado.push({ bien: bien._id as Types.ObjectId, cantidad, costo_unidad: bien!.valor });
    }
    else if (tipo == "Venta") {
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
    const status = (err instanceof Error && 'status' in err) ? (err as any).status || 500 : 500;
    const message = (err instanceof Error && 'message' in err) ? err.message : 'Error del servidor';
    res.status(status).send({ error: message });
  }
})
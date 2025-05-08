import express from 'express';
import { Cazador } from '../models/Cazadores.js';
import { Mercader } from '../models/Mercaderes.js';
import { Bien } from '../models/Bienes.js';
import { Types } from 'mongoose';
import { Transaccion } from '../models/Transaccion.js';

import mongoose from 'mongoose';

export const routerTransaccion = express.Router();

/**
 * Función que actualiza el stock de los bienes
 * 
 * @param tipo - Tipo de operación que se realiza
 * @param bienes - Array de bienes que queremos actualizar
 * @returns Promesa
 */
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

/**
 * Función que suma el numero de items y devuelve un monto
 * 
 * @param items - JSON con información sobre la operación a realizar
 * @returns - Suma de monto
 */
function sumarMonto(items: { 
  bien: Types.ObjectId; 
  cantidad: number; 
  costo_unidad: number; 
}[]): number {
  // Function implementation goes here
  return items.reduce((total, item) => total + item.cantidad * item.costo_unidad, 0);
}

/**
 * Operación post para el router de transacción
 */
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
  catch(error) {
    res.status(500).send({ message: "Ha ocurrido un error al añadir la transacción.", error });
  }
})

/**
 * Operación delete para el router de transacción
 */
routerTransaccion.delete("/:id", async (req, res) => {
  try {
    // Validamos si el ID es válido
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(404).send({ error: "Transacción no encontrada" });
      return;
    }

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
    res.status(500).send({ message: "Ha ocurrido un error al eliminar la transacción.", error });
  }
})

/**
 * Operación Get para el router de transacción a partir de un ID
 */
routerTransaccion.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(404).send({ error: "Transacción no encontrada" });
      return;
    }

    const transaccion = await Transaccion.findById(req.params.id);
    if (!transaccion) {
      res.status(404).send({ error: "Transacción no encontrada" });
      return;
    }
    res.status(200).send(transaccion);
  }
  catch (error) {
    res.status(500).send({ message: "Ha ocurrido un error al buscar la transacción por ID", error });
  }
});

/**
 * Operación Get para el router de transacción a través de query
 */
routerTransaccion.get("/", async (req, res) => {
  try {
    const { nombre, fecha_inicio, fecha_fin, tipo } = req.query;
    const transacciones = await Transaccion.find();
    const transacciones_encontradas = [];

    for (const transaccion of transacciones) {
      // Filtro por tipo y fechas si están presentes
      if (tipo && transaccion.tipo !== tipo) {
        continue;
      } 
      if (fecha_inicio && transaccion.fecha < new Date(fecha_inicio as string)) {
        continue; 
      }
      if (fecha_fin && transaccion.fecha > new Date(fecha_fin as string)) {
        continue;
      } 

      // Filtro por nombre si está presente
      if (nombre) {
        const persona = await Cazador.findById(transaccion.persona) || await Mercader.findById(transaccion.persona);
        if (!persona || persona.nombre !== nombre) {
          continue;
        }
      }

      transacciones_encontradas.push(transaccion);
    }

    res.status(200).send(transacciones_encontradas);
  } catch (error) {
    res.status(500).send({ message: "Ha ocurrido un error al buscar las transacciones", error });
  }
});

/**
 * Operación Patch para el router de transacción
 */
routerTransaccion.patch("/:id", async (req, res) => {
  try {
    // Validamos si el ID es válido
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(404).send({ error: "Transacción no encontrada" });
      return;
    }
    
    const transaccion = await Transaccion.findById(req.params.id);
    if (!transaccion) {
      res.status(404).send("No se ha encontrado la transacción");
      return
    }

    const { tipo, bienes, personaTipo, persona } = req.body;

    // Revertir el stock de la transacción original
    if (transaccion.tipo === "Compra") {
      await updateStock("DCompra", transaccion.bienes);
    } 
    else if (transaccion.tipo === "Venta") {
      await updateStock("DVenta", transaccion.bienes);
    }

    // Actualizar los datos de la transacción
    transaccion.tipo = tipo || transaccion.tipo;
    transaccion.bienes = bienes || transaccion.bienes;
    transaccion.personaTipo = personaTipo || transaccion.personaTipo;
    transaccion.persona = persona || transaccion.persona;

    // Validar y actualizar el stock con los nuevos datos
    if (bienes) {
      const items = await updateStock(transaccion.tipo, bienes);
      transaccion.monto = sumarMonto(items);
    }

    await transaccion.save();
    res.status(200).send(transaccion);
  } 
  catch (error) {
    res.status(500).send({ message: "Ha ocurrido un error al actualizar la transacción.", error });
  }
});
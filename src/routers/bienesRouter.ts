import express from 'express';
import { Bien } from '../models/Bienes.js'; // Asegúrate de que la ruta sea correcta

export const bienRouter = express.Router();

/**
 * En la ruta /goods devuelve todos los bienes en la base de datos
 */
bienRouter.get('/goods', async (req, res) => {
  try {
    const bienes = await Bien.find();
    res.status(200).send(bienes);
  } catch (error) {
    res.status(500).send(error);
  }
})

/**
 * Obtener bien con id
 */
bienRouter.get('/goods/:id', async (req, res) => {
  try {
    const bien = await Bien.findById(req.params.id)
    if (!bien) {
      res.status(404).send("No existe el bien")
      return
    }
    res.status(200).send(bien)
  } catch (error) {
    res.status(500).send(error)
  }
})

/**
 * Agrega un bien a la ruta goods
 */
bienRouter.post('/goods', async (req, res) => {
  const bien = new Bien(req.body);
  try {
    await bien.save();
    res.status(201).send(bien);
  } catch (error) {
    res.status(500).send(error);
  }
})

/**
 * Elimina un bien con id como query
 */
bienRouter.delete('/goods', async (req, res) => {
  if(!req.query.nombre) {
    res.status(400).send("Se debe proporcionar un nombre para eliminar el objeto")
  }
  else {
    try {
      const bien = await Bien.findOneAndDelete({nombre: req.query.nombre.toString()})
      if (!bien) {
        res.status(404).send()
      }
      else {
        res.status(200).send(bien)
      }
    } catch(error) {
      res.status(400).send(error)
    }
  }
})

/**
 * Eliminar un bien con id
 */
bienRouter.delete('/goods/:id', async (req, res) => {
  try {
    const bien  = await Bien.findByIdAndDelete(req.params.id)
    if (!bien) {
      res.status(404).send("Ha ocurrido un error a la hora de borrar un bien");
    } else {
      res.status(200).send(bien);
    }
  } catch (error) {
    res.status(400).send(error)
  }
});

/**
 * Modificar bien 
 */

bienRouter.patch('/goods', async (req, res) => {
  if (!req.query.nombre) {
    res.status(400).send("Se tiene que proporcionar un nombre");
  } 
  else if (!req.body) {
    res.status(400).send("Los campos a cambiar deber ser proporcionados en el request body");
  }
  else {
    const allowedUpdates = ['nombre', 'descripcion', 'material', 'peso', 'valor', 'stock'];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      res.status(400).send("El cambio no esta permitido");
    }
    else {
      try {
        const bien = await Bien.findOneAndUpdate({nombre: req.query.nombre.toString()}, req.body, {new: true, runValidators: true})
        if (!bien) {
          res.status(404).send();
        }
        else {
          res.send(bien);
        }
      } catch (error) {
        res.status(400).send(error);
      }
    }
  }
})

/**
 * Modificar bien sabiendo id
 */
bienRouter.patch('/goods/:id', async (req, res) => {
  if (!req.body) {
    res.status(400).send({
      error: 'Los campos a modificar deben ser proporcionados en el cuerpo de la solicitud',
    });
  } else {
    const allowedUpdates = ['nombre', 'descripcion', 'material', 'peso', 'valor', 'stock'];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      res.status(400).send({
        error: 'El cambio no está permitido',
      });
    } else {
      try {
        const bien = await Bien.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!bien) {
          res.status(404).send();
        } else {
          res.send(bien);
        }
      } catch (error) {
        res.status(400).send(error);
      }
    }
  }
});
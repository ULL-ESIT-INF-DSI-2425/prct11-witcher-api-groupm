import express from 'express';
import { Mercader } from '../models/Mercaderes.js';

const routerMercader = express.Router();

routerMercader.post('/merchants', async (req, res) => {
  const nuevoMercader = new Mercader(req.body);
  try {
    await nuevoMercader.save();
    res.status(201).send(nuevoMercader);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Obtener todos los mercaderes
routerMercader.get('/merchants', async (_req, res) => {
  try {
    const mercaderes = await Mercader.find();
    res.status(200).send(mercaderes);
  } catch (error) {
    res.status(500).send(error);
  }
});

routerMercader.get('/merchants/:id', async (req, res) => {
  try {
    const mercader = await Mercader.findById(req.params.id);
    if (!mercader) {
      res.status(404).send("No existe el mercader");
      return;
    }
    res.status(200).send(mercader);
  } catch (error) {
    res.status(500).send(error);
  }
});

// routerMercader.get('/nombre/:nombre', async (req, res) => {
//   try {
//     const mercader = await Mercader.find({ nombre: req.params.nombre });
//     res.json(mercader);
//   } catch {
//     res.status(500).json({ error: "Nombre inválido o error al buscar" });
//   }
// });

routerMercader.patch('/merchants', async (req, res) => {
  if (!req.query.nombre) {
    res.status(400).send("Se tiene que proporcionar un nombre");
  } 
  else if (!req.body) {
    res.status(400).send("Los campos a cambiar deber ser proporcionados en el request body");
  }
  else {
    const allowedUpdates = ['nombre', 'tipo', 'ubicacion'];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      res.status(400).send("El cambio no esta permitido");
    }
    else {
      try {
        const mercader = await Mercader.findOneAndUpdate({nombre: req.query.nombre.toString()}, req.body, {new: true, runValidators: true})
        if (!mercader) {
          res.status(404).send();
        }
        else {
          res.send(mercader);
        }
      } catch (error) {
        res.status(400).send(error);
      }
    }
  }
})

/**
 * Modificar mercader samercaderdo id
 */
routerMercader.patch('/merchants/:id', async (req, res) => {
  if (!req.body) {
    res.status(400).send({
      error: 'Los campos a modificar deben ser proporcionados en el cuerpo de la solicitud',
    });
  } else {
    const allowedUpdates = ['nombre', 'tipo', 'ubicacion'];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      res.status(400).send({
        error: 'El cambio no está permitido',
      });
    } else {
      try {
        const mercader = await Mercader.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!mercader) {
          res.status(404).send();
        } else {
          res.send(mercader);
        }
      } catch (error) {
        res.status(400).send(error);
      }
    }
  }
});

routerMercader.delete('/merchants', async (req, res) => {
  if (!req.query.nombre) {
    res.status(400).send("Se debe proporcionar un nombre para eliminar el objeto");
  }
  else {
    try {
      const mercader = await Mercader.findByIdAndDelete({nombre: req.query.nombre.toString()});
      if (!mercader) {
        res.status(404).send("Ha ocurrido un error a la hora de borrar un mercader");
      } else {
        res.status(200).send(mercader);
      }
    } catch (error) {
      res.status(400).json(error);
    }                                   
  }
});

routerMercader.delete('/merchants/:id', async (req, res) => {
  try {
    const mercader = await Mercader.findByIdAndDelete(req.params.id);
    if (!mercader) {
      res.status(404).send("Ha ocurrido un error a la hora de borrar un mercader");
    } else {
      res.status(200).send(mercader);
    }
  } catch (error) {
    res.status(400).json(error);
  }
});


export default routerMercader;
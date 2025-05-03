import express from 'express';
import { Cazador } from '../models/Cazadores.js'; // Asegúrate de que la ruta sea correcta

const routerCazador = express.Router();

// Crear un nuevo cazador
routerCazador.post('/hunters', async (req, res) => {
  const nuevoCazador = new Cazador(req.body);
  try {
    await nuevoCazador.save();
    res.status(201).send(nuevoCazador);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Obtener todos los cazadores
routerCazador.get('/hunters', async (_req, res) => {
  try {
    const cazadores = await Cazador.find();
    if (!cazadores) {
      res.status(404).send("No existe el cazador");
      return;
    }
    res.status(200).send(cazadores);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Obtener un cazador por ID
routerCazador.get('/hunters/:id', async (req, res) => {
  try {
    const cazador = await Cazador.findById(req.params.id);
    if (!cazador) {
      res.status(404).send("No existe el cazador");
      return;
    }
    res.status(200).json(cazador);
  } catch (error) {
    res.status(400).json(error);
  }
});

// Obtener un cazador por nombre
routerCazador.get('/nombre/:nombre', async (req, res) => {
  try {
    const cazador = await Cazador.findOne({ nombre: req.params.nombre });
    res.status(200).send(cazador);
  } catch (error) {
    res.status(400).send(error);
  }
});

routerCazador.patch('/goods', async (req, res) => {
  if (!req.query.nombre) {
    res.status(400).send("Se tiene que proporcionar un nombre");
  } 
  else if (!req.body) {
    res.status(400).send("Los campos a cambiar deber ser proporcionados en el request body");
  }
  else {
    const allowedUpdates = ['nombre', 'raza', 'ubicacion'];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      res.status(400).send("El cambio no esta permitido");
    }
    else {
      try {
        const cazador = await Cazador.findOneAndUpdate({nombre: req.query.nombre.toString()}, req.body, {new: true, runValidators: true})
        if (!cazador) {
          res.status(404).send();
        }
        else {
          res.send(cazador);
        }
      } catch (error) {
        res.status(400).send(error);
      }
    }
  }
})

// Actualizar un cazador
routerCazador.patch('/hunters/:id', async (req, res) => {
  if (!req.body) {
    res.status(400).send({
      error: 'Los campos a modificar deben ser proporcionados en el cuerpo de la solicitud',
    });
  }
  else {
    const allowedUpdates = ['nombre', 'raza', 'ubicacion'];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));
    
    if (!isValidUpdate) {
      res.status(400).send({
        error: 'El cambio no está permitido',
      });
    } else {
      try {
        const cazador = await Cazador.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!cazador) {
          res.status(404).send();
        } else {
          res.send(cazador);
        }
      } catch (error) {
        res.status(400).send(error);
      }
    }
  }
});

// Eliminar un cazador
routerCazador.delete('/:id', async (req, res) => {
  try {
    const cazador = await Cazador.findByIdAndDelete(req.params.id);
    if (!cazador) {
      res.status(404).send("Ha ocurrido un error a la hora de borrar un cazador");
    }
    else {
      res.status(200).send(cazador);
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

export default routerCazador;

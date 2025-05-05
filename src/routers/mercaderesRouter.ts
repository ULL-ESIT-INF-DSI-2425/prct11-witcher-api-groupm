import express from 'express';
import { Mercader } from '../models/Mercaderes.js';

export const routerMercader = express.Router();

/**
 * Crear un nuevo mercader
 * @param nombre - Nombre del mercader
 * @param body - Objeto JSON con los campos del mercader
 * @returns mercader - Objeto JSON con el mercader creado
 * @throws error - Si ya existe un mercader con el mismo nombre
 */
routerMercader.post('/', async (req, res) => {
  try {
    const existingMercader = await Mercader.findOne({ nombre: req.body.nombre });
    if (existingMercader) {
      res.status(400).send("Ya existe un mercader con el mismo nombre");
      return;
    }
    const nuevoMercader = new Mercader(req.body);
    await nuevoMercader.save();
    res.status(201).send(nuevoMercader);
  } catch (error) {
    res.status(500).send(error);
  }
});

/**
 * Obtener un mercader por nombre o todos los mercaderes
 * @param nombre - Nombre del mercader a obtener
 * @returns mercader - Objeto JSON con el mercader
 * @throws error - Si no se proporciona un nombre o si no existe un mercader con ese nombre
 */
routerMercader.get('/', async (req, res) => {
  try {
    let mercader;
    if (req.query.nombre) {
      mercader = await Mercader.findOne({ nombre: req.query.nombre });
    } else {
      mercader = await Mercader.find();
    }
    if (!mercader) {
      res.status(404).send("No existe mercader con ese nombre");
      return;
    }
    res.json(mercader);
  } catch {
    res.status(500).json({ error: "Nombre inválido o error al buscar" });
  }
});

/**
 * Obtener un mercader por ID
 * @param id - ID del mercader a obtener
 * @returns mercader - Objeto JSON con el mercader
 * @throws error - Si no se proporciona un ID o si no existe un mercader con ese ID
 */
routerMercader.get('/:id', async (req, res) => {
  try {
    const mercader = await Mercader.findById(req.params.id);
    if (!mercader) {
      res.status(404).send("No existe mercader con ese ID");
      return;
    }
    res.status(200).send(mercader);
  } catch (error) {
    res.status(500).send(error);
  }
});

/**
 * Modificar mercader por nombre
 * @param nombre - Nombre del mercader a modificar
 * @param body - Objeto JSON con los campos a modificar
 * @returns mercader - Objeto JSON con el mercader modificado
 * @throws error - Si no se proporciona un nombre o si no existe un mercader con ese nombre
 */
routerMercader.patch('/', async (req, res) => {
  if (!req.query.nombre) {
    res.status(400).send("El nombre del mercader a modificar debe ser proporcionado en la URL");
    return;
  }
  if (!req.body) {
    res.status(400).send("Los campos a cambiar deber ser proporcionados en el request body");
    return;
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
          res.status(404).send("No existe mercader con ese nombre");
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
 * Modificar mercader por ID
 * @param id - ID del mercader a modificar
 * @param body - Objeto JSON con los campos a modificar
 * @returns mercader - Objeto JSON con el mercader modificado
 * @throws error - Si no se proporciona un ID o si no existe un mercader con ese ID
 */
routerMercader.patch('/:id', async (req, res) => {
  if (!req.body) {
    res.status(400).send('Los campos a modificar deben ser proporcionados en el cuerpo de la solicitud');
    return;
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
          res.status(404).send("No existe mercader con ese ID");
        } else {
          res.send(mercader);
        }
      } catch (error) {
        res.status(400).send(error);
      }
    }
  }
});

/**
 * Eliminar un mercader por nombre
 * @param nombre - Nombre del mercader a eliminar
 * @returns mercader - Objeto JSON con el mercader eliminado
 * @throws error - Si no se proporciona un nombre o si no existe un mercader con ese nombre
 */
routerMercader.delete('/', async (req, res) => {
  if (!req.query.nombre) {
    res.status(400).send("El nombre del mercader a eliminar debe ser proporcionado en la URL");
    return;
  }
  try {
    const mercader = await Mercader.findByIdAndDelete({nombre: req.query.nombre.toString()});
    if (!mercader) {
      res.status(404).send("No existe mercader con ese nombre");
    } else {
      res.status(200).send(mercader);
    }
  } catch (error) {
    res.status(400).json(error);
  }                                   
});

/**
 * Eliminar un mercader por ID
 * @param id - ID del mercader a eliminar
 * @returns mercader - Objeto JSON con el mercader eliminado
 * @throws error - Si no se proporciona un ID o si no existe un mercader con ese ID
 */
routerMercader.delete('/:id', async (req, res) => {
  try {
    const mercader = await Mercader.findByIdAndDelete(req.params.id);
    if (!mercader) {
      res.status(404).send("No existe mercader con ese ID");
    } else {
      res.status(200).send(mercader);
    }
  } catch (error) {
    res.status(400).json(error);
  }
});
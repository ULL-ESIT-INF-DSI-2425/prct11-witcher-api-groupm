import express from 'express';
import { Bien } from '../models/Bienes.js'; // Asegúrate de que la ruta sea correcta

export const routerBien = express.Router();

/**
 * Agrega un bien a la ruta goods
 * @param nombre - Nombre del bien
 * @param body - Objeto JSON con los campos del bien
 * @returns bien - Objeto JSON con el bien creado
 * @throws error - Si ya existe un bien con el mismo nombre
 */
routerBien.post('/', async (req, res) => {
  try {
    const bienExistente = await Bien.findOne({ $or: [{ nombre: req.body.nombre }, { descripcion: req.body.descripcion }] });
    if (bienExistente) {
      res.status(400).send("Ya existe un bien con el mismo nombre o descripción");
      return;
    }
    const nuevoBien = new Bien(req.body);
    await nuevoBien.save();
    res.status(201).send(nuevoBien);
  } catch (error) {
    res.status(500).send(error);
  }
})

/**
 * Obtener un bien con nombre o descripcion o todos en su defecto
 * @param nombre - Nombre del bien a obtener
 * @param descripcion - Descripcion del bien a obtener
 * @returns bienes - Objeto JSON con todos los bienes
 * @throws error - Si no se encuentran bienes
 */
routerBien.get('/', async (req, res) => {
  try {
    let bienes;
    if (req.query.nombre && req.query.descripcion) {
      bienes = await Bien.find({nombre: req.query.nombre, descripcion: req.query.descripcion})
    } else if (req.query.nombre) {
      bienes = await Bien.find({nombre: req.query.nombre})
    } else if (req.query.descripcion) {
      bienes = await Bien.find({descripcion: req.query.descripcion})
    } else {
      bienes = await Bien.find();
    }
    if (bienes.length === 0) {
      res.status(404).send("No existe ningún bien con el campo especificado, o no existe ningún bien");
      return;
    }
    res.status(200).send(bienes);
  } catch (error) {
    res.status(500).send(error);
  }
})

/**
 * Obtener bien con nombre o descripcion
 * @param nombre - Nombre del bien a obtener
 * @param descripcion - Descripcion del bien a obtener
 * @returns bien - Objeto JSON con el bien
 * @throws error - Si no se proporciona un nombre o una descripcion
 */
routerBien.get('/:id', async (req, res) => {
  try {
    const bien = await Bien.findById(req.params.id)
    if (!bien) {
      res.status(404).send("No existe bien con ese ID");
      return
    }
    res.status(200).send(bien)
  } catch (error) {
    res.status(500).send(error)
  }
})

/**
 * Obtener bien con nombre o descripcion
 * @param nombre - Nombre del bien a obtener
 * @param descripcion - Descripcion del bien a obtener
 * @returns bien - Objeto JSON con el bien
 * @throws error - Si no se proporciona un nombre o una descripcion
 */
routerBien.patch('/', async (req, res) => {
  if (!req.query.nombre && !req.query.descripcion) {
    res.status(400).send("Se tiene que proporcionar un nombre o una descripcion");
    return;
  }
  if (!req.body) {
    res.status(400).send("Los campos a cambiar deber ser proporcionados en el request body");
  } else {
    const allowedUpdates = ['nombre', 'descripcion', 'material', 'peso', 'valor', 'stock'];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      res.status(400).send("El cambio no esta permitido");
    }
    else {
      try {
        let bien;
        if (req.query.nombre && req.query.descripcion) {
          bien = await Bien.findOneAndUpdate({nombre: req.query.nombre, descripcion: req.query.descripcion}, req.body, {new: true, runValidators: true})
        } else if (req.query.nombre) {
          bien = await Bien.findOneAndUpdate({nombre: req.query.nombre}, req.body, {new: true, runValidators: true})
        } else {
          bien = await Bien.findOneAndUpdate({descripcion: req.query.descripcion}, req.body, {new: true, runValidators: true})
        }
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
 * Modificar bien con id
 * @param id - ID del bien a modificar
 * @param body - Objeto JSON con los campos a modificar
 * @returns bien - Objeto JSON con el bien modificado
 * @throws error - Si no se proporciona un ID o si no existe un bien con ese ID
 */
routerBien.patch('/:id', async (req, res) => {
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

/**
 * Elimina un bien con nombre o descripcion
 * @param nombre - Nombre del bien a
 * @param descripcion - Descripcion del bien a eliminar
 * @returns bien - Objeto JSON con el bien eliminado
 * @throws error - Si no se proporciona un nombre o una descripcion
 */
routerBien.delete('/', async (req, res) => {
  if (!req.query.nombre && !req.query.descripcion) {
    res.status(400).send("Se tiene que proporcionar un nombre o una descripcion");
    return;
  }
  try {
    let bien;
    if (req.query.nombre && req.query.descripcion) {
      bien = await Bien.findOneAndDelete({nombre: req.query.nombre, descripcion: req.query.descripcion})
    } else if (req.query.nombre) {
      bien = await Bien.findOneAndDelete({nombre: req.query.nombre})
    } else {
      bien = await Bien.findOneAndDelete({descripcion: req.query.descripcion})
    }
    if (!bien) {
      res.status(404).send()
    }
    else {
      res.status(200).send(bien)
    }
  } catch(error) {
    res.status(400).send(error)
  }
})

/**
 * Eliminar un bien con id
 * @param id - ID del bien a eliminar
 * @returns bien - Objeto JSON con el bien eliminado
 * @throws error - Si no se proporciona un ID
 */
routerBien.delete('/:id', async (req, res) => {
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
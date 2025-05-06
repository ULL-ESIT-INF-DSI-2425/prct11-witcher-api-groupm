import { Request, Response } from 'express';
import { Cazador } from '../models/Cazadores.js';

/**
 * Crear un nuevo cazador
 * @param nombre - Nombre del cazador
 * @param body - Objeto JSON con los campos del cazador
 * @returns cazador - Objeto JSON con el cazador creado
 * @throws error - Si ya existe un cazador con el mismo nombre
 */
export const crearCazador = async (req: Request, res: Response) => {
  try {
    const cazadorExistente = await Cazador.findOne({ nombre: req.body.nombre });
    if (cazadorExistente) {
      res.status(400).send("Ya existe un cazador con el mismo nombre");
      return;
    }
    const nuevoCazador = new Cazador(req.body);
    await nuevoCazador.save();
    res.status(201).send(nuevoCazador);
  } catch (error) {
    res.status(500).send(error);
  }
}

/**
 * Obtener un cazador por nombre o a todos los cazadores
 * @param nombre - Nombre del cazador a obtener
 * @returns cazador - Objeto JSON con el cazador
 * @throws error - Si no se proporciona un nombre o si no existe un cazador con ese nombre
 */
export const obtenerCazadores = async (req: Request, res: Response) => {
  try {
    let cazador;
    if (req.query.nombre) {
      cazador = await Cazador.findOne({ nombre: req.query.nombre.toString() });
    } else {
      cazador = await Cazador.find();
    }
    if (!cazador || (Array.isArray(cazador) && cazador.length === 0)) {
      res.status(404).send("No existe cazador con ese nombre, o no existen cazadores");
      return;
    }
    res.status(200).send(cazador);
  } catch (error) {
    res.status(400).send(error);
  }
}

/**
 * Obtener un cazador por ID
 * @param id - ID del cazador a obtener 
 * @returns cazador - Objeto JSON con el cazador
 * @throws error - Si no existe un cazador con ese ID
 */
export const obtenerCazadorID = async (req: Request, res: Response) => {
  try {
    const cazador = await Cazador.findById(req.params.id);
    res.status(200).json(cazador);
  } catch (error) {
    res.status(400).json(error);
  }
}

/**
 * Actualizar cazador por nombre
 * @param nombre - Nombre del cazador a actualizar
 * @param body - Objeto JSON con los campos a actualizar
 * @returns cazador - Objeto JSON con el cazador actualizado
 * @throws error - Si no se proporciona un nombre o si no existe un cazador con ese nombre
 */
export const actualizarCazador = async (req: Request, res: Response) => {
  if (!req.query.nombre) {
    res.status(400).send("El nombre del cazador a eliminar debe ser proporcionado");
    return;
  }
  if (!req.body) {
    res.status(400).send("Los campos a modificar deben ser proporcionados en el cuerpo de la solicitud");
    return;
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
        const cazador = await Cazador.findOneAndUpdate({nombre: req.query.nombre.toString()}, req.body, {new: true, runValidators: true});
        if (!cazador) {
          res.status(404).send("No existe cazador con ese nombre");
          return;
        }
        res.send(cazador);
      } catch (error) {
        res.status(400).send(error);
      }
    }
  }
}

/**
 * Actualizar cazador por ID
 * @param id - ID del cazador a actualizar
 * @param body - Objeto JSON con los campos a actualizar
 * @returns cazador - Objeto JSON con el cazador actualizado
 * @throws error - Si no se proporciona un ID o si no existe un cazador con ese ID
 */
export const actualizarCazadorID = async (req: Request, res: Response) => {
  if (!req.body) {
    res.status(400).send('Los campos a modificar deben ser proporcionados en el cuerpo de la solicitud');
    return;
  }
  else {
    const allowedUpdates = ['nombre', 'raza', 'ubicacion'];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));
    
    if (!isValidUpdate) {
      res.status(400).send('El cambio no está permitido');
      return;
    } else {
      try {
        const cazador = await Cazador.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true,
        });
        res.send(cazador);
      } catch (error) {
        res.status(400).send(error);
      }
    }
  }
}

/**
 * Eliminar un cazador por nombre
 * @param nombre - Nombre del cazador a eliminar
 * @returns cazador - Objeto JSON con el cazador eliminado
 * @throws error - Si no se proporciona un nombre o si no existe un cazador con ese nombre
 */
export const borrarCazador = async (req: Request, res: Response) => {
  if (!req.query.nombre) {
    res.status(400).send("El nombre del cazador a eliminar debe ser proporcionado");
    return;
  }
  try {
    const cazador = await Cazador.findOneAndDelete({nombre: req.query.nombre.toString()});
    if (!cazador) {
      res.status(404).send("No existe cazador con ese nombre");
      return;
    } else {
      res.status(200).send(cazador);
    }
  } catch (error) {
    res.status(400).json(error);
  }
}

/**
 * Eliminar un cazador por ID
 * @param id - ID del cazador a eliminar
 * @returns cazador - Objeto JSON con el cazador eliminado
 * @throws error - Si no existe un cazador con ese ID
 */
export const borrarCazadorID = async (req: Request, res: Response) => {
  try {
    const cazador = await Cazador.findByIdAndDelete(req.params.id);
    res.status(200).send(cazador);
  } catch (error) {
    res.status(400).send(error);
  }
}
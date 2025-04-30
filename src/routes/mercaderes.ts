import express from 'express';
import { Mercader } from '../models/Mercaderes.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const nuevoMercader = new Mercader(req.body);
    const guardado = await nuevoMercader.save();
    res.status(201).json(guardado);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear el mercader', detalle: error });
  }
});

// Obtener todos los mercaderes
router.get('/', async (_req, res) => {
  try {
    const mercaderes = await Mercader.find();
    res.json(mercaderes);
  } catch {
    res.status(500).json({ error: "Error al obtener los mercaderes" });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const mercader = await Mercader.findById(req.params.id);
    res.json(mercader);
  } catch {
    res.status(500).json({ error: "ID inválido o error al buscar" });
  }
});

router.get('/nombre/:nombre', async (req, res) => {
  try {
    const mercader = await Mercader.find({ nombre: req.params.nombre });
    res.json(mercader);
  } catch {
    res.status(500).json({ error: "Nombre inválido o error al buscar" });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const MercaderActualizado = await Mercader.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(MercaderActualizado);
  } catch {
    res.status(400).json({ error: 'Error al actualizar el mercader' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Mercader.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Mercader eliminado correctamente' }, );
  } catch {
    res.status(400).json({ error: 'Error al eliminar el mercader' });
  }
});

router.delete('/nombre', async (req, res) => {
  if (!req.query.nombre) {
    res.status(400).json({ error: 'Deber introducir un nombre' });
  }
  else {
    try {
      const mercader = await Mercader.findOne({
        nombre: req.query.nombre.toString(),
      });
      if (!mercader) {
        res.status(404).json({ error: "No existe mercader con ese nombre" });
      } else {
        const resultado = await Mercader.deleteOne({ _id: mercader._id });
        res.json({ mensaje: 'Mercader eliminado correctamente', resultado });
      }
    } catch {
      res.status(400).json({ error: 'Error al eliminar el mercader' });
    }
  }
});


export default router;
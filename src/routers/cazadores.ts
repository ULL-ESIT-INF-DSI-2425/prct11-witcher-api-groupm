import express from 'express';
import { Cazador } from '../models/Cazadores.js'; // Asegúrate de que la ruta sea correcta

const router = express.Router();

// Crear un nuevo cazador
router.post('/', async (req, res) => {
  try {
    const nuevoCazador = new Cazador(req.body);
    const guardado = await nuevoCazador.save();
    res.status(201).json(guardado);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear el cazador', detalle: error });
  }
});

// Obtener todos los cazadores
router.get('/', async (_req, res) => {
  try {
    const cazadores = await Cazador.find();
    res.json(cazadores);
  } catch {
    res.status(500).json({ error: 'Error al obtener los cazadores' });
  }
});

// Obtener un cazador por ID
router.get('/:id', async (req, res) => {
  try {
    const cazador = await Cazador.findById(req.params.id);
    res.json(cazador);
  } catch {
    res.status(400).json({ error: 'ID inválido o error al buscar' });
  }
});

// Obtener un cazador por nombre
router.get('/nombre/:nombre', async (req, res) => {
  try {
    const cazador = await Cazador.findOne({ nombre: req.params.nombre });
    res.json(cazador);
  } catch {
    res.status(400).json({ error: 'Error al buscar el cazador' });
  }
});

// Actualizar un cazador
router.put('/:id', async (req, res) => {
  try {
    const actualizado = await Cazador.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(actualizado);
  } catch {
    res.status(400).json({ error: 'Error al actualizar el cazador' });
  }
});

// Eliminar un cazador
router.delete('/:id', async (req, res) => {
  try {
    await Cazador.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Cazador eliminado correctamente' });
  } catch {
    res.status(400).json({ error: 'Error al eliminar el cazador' });
  }
});

export default router;

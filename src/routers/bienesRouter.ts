import express from 'express';
import { crearBien, obtenerBienes, obtenerBienID, actualizarBien, actualizarBienID, borrarBien, borrarBienID } from '../controllers/bienesController.js'; // Asegúrate de que la ruta sea correcta

export const routerBien = express.Router();

/**
 * Crear un nuevo bien
 */
routerBien.post('/', crearBien);

/**
 * Obtener un bien con nombre o descripcion o todos en su defecto
 */
routerBien.get('/', obtenerBienes);

/**
 * Obtener bien con ID
 */
routerBien.get('/:id', obtenerBienID);

/**
 * Modificar bien con nombre o descripcion
 */
routerBien.patch('/', actualizarBien);

/**
 * Modificar bien con ID
 */
routerBien.patch('/:id', actualizarBienID);

/**
 * Eliminar un bien por su nombre o descripcion
 */
routerBien.delete('/', borrarBien);

/**
 * Eliminar un bien por su ID
 */
routerBien.delete('/:id', borrarBienID);
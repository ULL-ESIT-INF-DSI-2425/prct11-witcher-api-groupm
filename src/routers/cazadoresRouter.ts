import express from 'express';
import { crearCazador, obtenerCazadores, obtenerCazadorID, actualizarCazador, actualizarCazadorID, borrarCazador, borrarCazadorID } from '../controllers/cazadoresController.js';

export const routerCazador = express.Router();

/**
 * Crear un nuevo cazador
 */
routerCazador.post('/', crearCazador);

/**
 * Obtener un cazador con nombre o todos en su defecto
 */
routerCazador.get('/', obtenerCazadores);

/**
 * Obtener cazador con ID
 */
routerCazador.get('/:id', obtenerCazadorID);

/**
 * Modificar cazador con nombre
 */
routerCazador.patch('/', actualizarCazador);

/**
 * Modificar cazador con ID
 */
routerCazador.patch('/:id', actualizarCazadorID);

/**
 * Eliminar un cazador por su nombre
 */
routerCazador.delete('/', borrarCazador);

/**
 * Eliminar un cazador por su ID
 */
routerCazador.delete('/:id', borrarCazadorID);
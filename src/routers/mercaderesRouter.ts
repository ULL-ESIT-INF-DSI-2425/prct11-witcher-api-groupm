import express from 'express';
import { crearMercader, obtenerMercaderes, obetenerMercaderID, actualizarMercader, actualizarMercaderID, borrarMercader, borrarMercaderID } from '../controllers/mercarederesController.js';

export const routerMercader = express.Router();

/**
 * Crear un nuevo mercader
 */
routerMercader.post('/', crearMercader);

/**
 * Obtener mercader por nombre o todos los mercaderes
 */
routerMercader.get('/', obtenerMercaderes);

/**
 * Obtener un mercader por ID
 */
routerMercader.get('/:id', obetenerMercaderID);

/**
 * Modificar mercader por nombre
 */
routerMercader.patch('/', actualizarMercader);

/**
 * Modificar mercader por ID
 */
routerMercader.patch('/:id', actualizarMercaderID);

/**
 * Eliminar un mercader por nombre
 */
routerMercader.delete('/', borrarMercader);

/**
 * Eliminar un mercader por ID
 */
routerMercader.delete('/:id', borrarMercaderID);
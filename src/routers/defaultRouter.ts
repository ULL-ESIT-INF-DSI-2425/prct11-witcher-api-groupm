import express from 'express';

export const defaultRouter = express.Router();

/**
 * Ruta por defecto para manejar peticiones no implementadas
 * @param splat - Ruta no implementada
 * @returns 501 - Ruta no implementada
 */
defaultRouter.all('/{*splat}', (_, res) => {
  res.status(501).send('Ruta no implementada');
});
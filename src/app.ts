import express from 'express';
import { connectDB } from './db/database.js'; // Asegúrate de que la ruta sea correcta
import { defaultRouter } from './routers/defaultRouter.js';
import { routerBien } from './routers/bienesRouter.js';
import { routerCazador } from './routers/cazadoresRouter.js';
import { routerMercader } from './routers/mercaderesRouter.js';
import { routerTransaccion } from './routers/transaccionRouter.js';

export const app = express();
const port = process.env.PORT || 3000; // Usa el puerto de la variable de entorno o 3000 como predeterminado

// Middleware to parse JSON
app.use(express.json());

app.use('/hunters', routerCazador); // Usar el router de cazadores
app.use('/merchants', routerMercader); // Usar el router de mercaderes
app.use('/goods', routerBien); // Usar el router de mercaderes
app.use('/transactions', routerTransaccion);

app.use(defaultRouter) // Usar el router por defecto para interceptar rutas no implementadas

connectDB(); // Conectar a la base de datos

// Basic route
app.get('/', (_, res) => {
  res.send('Servidor Express funcionando!');
});

/**
 * Inicia el servidor en el puerto especificado
 * @param port - Puerto en el que se ejecutará el servidor
 */
app.listen(port, () => {
  console.log(`Servidor rodando en http://localhost:${port}`);
});
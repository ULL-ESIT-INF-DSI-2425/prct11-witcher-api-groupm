import express from 'express';
import { connectDB } from './config/database.js'; // Asegúrate de que la ruta sea correcta
import router from './routers/cazadoresRouter.js';
import { bienRouter } from './routers/bienesRouter.js';
import { defaultRouter } from './routers/defaultRouter.js';

const app = express();
const port = process.env.PORT || 3000; // Usa el puerto de la variable de entorno o 3000 como predeterminado

// Middleware to parse JSON
app.use(express.json());

app.use('/cazadores', router); // Usar el router de cazadores
app.use('/merchants', router); // Usar el router de mercaderes

app.use(bienRouter)
app.use(defaultRouter)

connectDB(); // Conectar a la base de datos

// Basic route
app.get('/', (_, res) => {
  res.send('Servidor Express funcionando!');
});

// Start the server
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
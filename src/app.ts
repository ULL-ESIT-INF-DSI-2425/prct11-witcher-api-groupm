import express from 'express';

const app = express();
const port = process.env.PORT || 3000; // Usa el puerto de la variable de entorno o 3000 como predeterminado

// Middleware to parse JSON
app.use(express.json());

// Basic route
app.get('/', (_, res) => {
  res.send('Servidor Express funcionando!');
});

// Start the server
app.listen(port, () => {
  console.log(`Servidor rodando em https://prct11-witcher-api-groupm.onrender.com:${port}`);
});
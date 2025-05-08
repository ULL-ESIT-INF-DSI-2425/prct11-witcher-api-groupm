import mongoose from 'mongoose';
import chalk from 'chalk';

/**
 * Conecta a la base de datos MongoDB
 * @throws error - Error si no se puede conectar
 */
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL!);
    console.log(chalk.green('Conectado a MongoDB'));
  } catch (error) {
    console.error(chalk.red('Error conectando a MongoDB:', error));
    process.exit(1);
  }
};
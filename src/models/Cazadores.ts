// ID único.
// Nombre.
// Raza. (Ejemplo: Humano, elfo, enano, hechicero).
// Ubicación.

import { Document, Schema, model } from 'mongoose';

interface CazadorInterface extends Document {
  nombre: string
  raza: "Humano" | "Elfo" | "Enano" | "Hechicero"
  ubicacion: "Novigrado" | "Velen" | "Kaer Trolde"
}

const CazadorSchema = new Schema<CazadorInterface>({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  raza: {
    type: String,
    trim: true,
    enum: ["Humano", "Elfo", "Enano", "Hechicero"],
  },
  ubicacion: {
    type: String,
    trim: true,
    enum: ["Novigrado", "Velen", "Kaer Trolde"],
    required: true,
  },
});

export const Cazador = model<CazadorInterface>('Cazadores', CazadorSchema);
// ID único.
// Nombre. (Ejemplo: Espada de Plata de Kaer Morhen, Elixires de Golondrina).
// Descripción. Narra su origen y utilidad.
// Material. (Ejemplo: Acero de Mahakam, cuero endurecido, esencia mágica o mutágenos de bestias antiguas).
// Peso.
// Valor en coronas.

import { Document, Schema, model } from 'mongoose';

interface BienesInterface extends Document {
  nombre: string
  descripcion: string
  material: "Acero de Mahakam" | "Cuero endurecido" | "Esencia mágica" | "Mutágenos de bestias antiguas"
  peso: number
  valor: number
  stock: number
}

const BienesSchema = new Schema<BienesInterface>({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  descripcion: {
    type: String,
    trim: true,
    validate: (value: string) => {
      if (value.length > 50) {
        throw new Error('La descripción no debe tener más de 50 caracteres');
      }
    },
  },
  material: {
    type: String,
    trim: true,
    enum: ["Acero de Mahakam", "Cuero endurecido", "Esencia mágica", "Mutágenos de bestias antiguas"],
    required: true,
  },
  peso: {
    type: Number,
    required: true,
    min: 0,
  },
  valor: {
    type: Number,
    required: true,
    min: 0,
  },
  stock: {
    type: Number,
    requiered: true,
    min: 0,
  },
});

export const Bien = model<BienesInterface>('Bienes', BienesSchema);
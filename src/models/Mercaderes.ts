// ID único.
// Nombre. (Ejemplo: Hattori, Fergus Graem).
// Tipo. (Ejemplo: Herrero, alquimista, mercader general).
// Ubicación. (Ejemplo: Novigrado, Velen, Kaer Trolde).

import { Document, Schema, model } from 'mongoose';

interface MercaderInterface extends Document {
  nombre: string
  tipo: "Herrero" | "Alquimista" | "Mercader general"
  ubicacion: "Novigrado" | "Velen" | "Kaer Trolde"
}

const MercaderSchema = new Schema<MercaderInterface> ({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  tipo: {
    type: String,
    trim: true,
    enum: ["Herrero", "Alquimista", "Mercader general"],
    required: true,
  },
  ubicacion: {
    type: String,
    trim: true,
    enum: ["Novigrado", "Velen", "Kaer Trolde"],
    required: true,
  },
})

export const Mercader = model<MercaderInterface>('Mercaderes', MercaderSchema);
import { Document, Schema, model } from 'mongoose';
import { Types } from 'mongoose';
import { CazadorInterface } from '../models/Cazadores.js';
import { MercaderInterface } from './Mercaderes.js';

// Definir schema para unsolo item {ID, cantidad, costo_unidad, nombre}
// Definimos schema de transacción

interface transaccionInterface {
  fecha: Date
  tipo: 'Compra' | 'Venta'
  bienes: {
            nombre: string
            descripcion: string
            material: "Acero de Mahakam" | "Cuero endurecido" | "Esencia mágica" | "Mutágenos de bestias antiguas"
            peso: number
            valor: number
            cantidad: number
          }[]
  personaTipo: "Mercader" | "Cazador"
  persona: CazadorInterface | MercaderInterface;
  monto: number
}

const transaccionSchema = new Schema<transaccionInterface>({
  fecha: {
    type: Date,
    default: Date.now,
  },
  tipo: {
    type: String,
    enum: ['Compra', 'Venta'],
    required: true,
  },
  bienes: [ // Array de bienes
    {
      nombre: {
        type: String,
        required: true,
      },
      descripcion: {
        type: String,
      },
      material: {
        type: String,
        enum: ["Acero de Mahakam", "Cuero endurecido", "Esencia mágica", "Mutágenos de bestias antiguas"],
        required: true,
      },
      peso: {
        type: Number,
        required: true,
      },
      valor: {
        type: Number,
        required: true,
      },
      cantidad: {
        type: Number,
        required: true,
      },
    },
  ],
  personaTipo: {
    type: String,
    enum: ['Mercader', 'Cazador'],
    required: true,
    validate: {
      validator: function (this: transaccionInterface) {
        return (this.tipo === 'Venta' && this.personaTipo === 'Mercader') ||
               (this.tipo === 'Compra' && this.personaTipo === 'Cazador');
      },
      message: 'personaTipo tiene que ser: Venta -> Cazador, Compra -> Mercader',
    },
  },
  persona: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: function (this: transaccionInterface) {
      return this.tipo === 'Compra' ? 'Cazadores' : 'Mercaderes';
    },
  },
  monto: {
    type: Number,
    required: true,
    default: function (this: transaccionInterface) {
      return this.bienes.reduce((total, item) => total + item.cantidad * item.valor, 0);
    },
  },
})

export const Transaccion = model<transaccionInterface>("Transaccion", transaccionSchema)
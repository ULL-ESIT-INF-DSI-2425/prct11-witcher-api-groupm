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
            cantidad: number; 
            costo_unidad: number; 
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
      cantidad: {
        type: Number,
        required: true,
      },
      costo_unidad: {
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
      return this.bienes.reduce((total, item) => total + item.cantidad * item.costo_unidad, 0);
    },
  },
})

export const Transaccion = model<transaccionInterface>("Transaccion", transaccionSchema)
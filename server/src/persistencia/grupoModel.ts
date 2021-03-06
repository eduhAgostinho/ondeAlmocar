import { Schema, SchemaTypes, Document, model } from "mongoose";
import { Grupo } from "../entidades/Grupo";

const GrupoSchema = new Schema({
    nome: { type: String, required: true },
    codigo: { type: String, required: true },
    restaurantesEscolhidos: [{
        restaurante: { type: SchemaTypes.ObjectId, ref: 'restaurante' },
        data: { type: Date, default: new Date() }
    }],
    votacao: {
        status: { type: Boolean, deafault: false },
        restaurantes: [
            {
                restaurante: { type: SchemaTypes.ObjectId, ref: 'restaurante' },
                curtidas: { type: Number, default: 0 },
                data: { type: Date, default: new Date() }
            }
        ]
    }
});
interface GrupoDocument extends Document, Grupo { };
export const GrupoModel = model<GrupoDocument>('grupo', GrupoSchema);
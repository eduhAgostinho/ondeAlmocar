import { Schema, SchemaTypes, Document, model } from "mongoose";
import { Grupo } from "../entidades/Grupo";

const GrupoSchema = new Schema({
    nome: { type: String, required: true },
    integrantes: [{ type: SchemaTypes.ObjectId, ref: 'usuario' }],
    codigo: { type: String, required: true },
    restaurantesEscolhidos: [{ type: SchemaTypes.ObjectId, ref: 'restaurante' }],
    votacao: [{ 
        restaurante: { type: SchemaTypes.ObjectId, ref: 'restaurante' },
        curtidas : { types: Number, default: 0 },
        data: { type: Date, default: new Date() } 
    }]
});
interface GrupoDocument extends Document, Grupo {}
export const GrupoModel = model<GrupoDocument>('grupo', GrupoSchema);
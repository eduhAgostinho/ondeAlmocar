import { Schema, SchemaType, SchemaTypes, Document, model } from "mongoose";
import { Usuario } from "../entidades/Usuario";

const UsuarioSchema = new Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
    ultimoVoto: { type: Date },
    grupo: { type: SchemaTypes.ObjectId, ref: 'grupo'}    
});
interface UsuarioDocument extends Document, Usuario {}
export const UsuarioModel = model<UsuarioDocument>('usuario', UsuarioSchema);
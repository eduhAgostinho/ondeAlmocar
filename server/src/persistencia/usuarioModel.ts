import { Schema, SchemaType, SchemaTypes, Document, model } from "mongoose";
import { Usuario } from "../entidades/Usuario";

const UsuarioSchema = new Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
    ultimoVoto: { type: Date, default: new Date() },
    grupo: { type: SchemaTypes.ObjectId, ref: 'grupo', default: null}    
});
interface UsuarioDocument extends Document, Usuario {}
export const UsuarioModel = model<UsuarioDocument>('usuario', UsuarioSchema);
import { Schema, Document, model } from "mongoose";
import { Restaurante } from "../entidades/Restaurante";

const RestauranteSchema = new Schema({
    nome: { type: String, required: true },
    endereco: { type: String, required: true }
});
interface RestauranteDocument extends Document, Restaurante {}
export const RestauranteModel = model<RestauranteDocument>('restaurante', RestauranteSchema);

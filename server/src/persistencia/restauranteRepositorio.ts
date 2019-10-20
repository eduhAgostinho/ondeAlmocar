import { Restaurante } from "../entidades/Restaurante";
import { RestauranteModel } from "./restauranteModel";

export async function novoRestaurante(restaurante: Restaurante) {
    return RestauranteModel.create(restaurante);
}

export async function buscarRestaurantes(ids ?: string[]) {
    return RestauranteModel.find({ _id: { $nin: ids } }).exec();
}


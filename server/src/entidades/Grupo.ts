import { Usuario } from "./Usuario";
import { RestauranteVotacao, Restaurante, RestauranteBusca } from "./Restaurante";

export interface Grupo {
    nome: string,
    codigo: string,
    restaurantesEscolhidos: {data: Date, restaurante: RestauranteBusca}[],
    votacao: RestauranteVotacao[]
}

export interface GrupoBusca extends Grupo{
    _id: string;
}
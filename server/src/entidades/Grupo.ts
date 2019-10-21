import { Usuario } from "./Usuario";
import { RestauranteVotacao, Restaurante, RestauranteBusca } from "./Restaurante";

export interface Grupo {
    nome: string,
    integrantes: Usuario[],
    codigo: string,
    restaurantesEscolhidos: RestauranteBusca[],
    votacao: RestauranteVotacao[]
}
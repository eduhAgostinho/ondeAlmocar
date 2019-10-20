import { Usuario } from "./Usuario";
import { RestauranteVotacao } from "./Restaurante";

export interface Grupo {
    nome: string,
    integrantes: Usuario[],
    codigo: string,
    restaurantesEscolhidos:  RestauranteVotacao[],
    votacao: RestauranteVotacao[]
}
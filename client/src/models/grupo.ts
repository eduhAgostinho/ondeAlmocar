import { RestauranteBusca, RestauranteVotacao } from './restaurante';
import { Votacao } from './votacao';

export interface Grupo {
    nome: string;
    codigo?: string;
    restaurantesEscolhidos: {data: Date, restaurante: RestauranteBusca}[];
    votacao: Votacao;
}

export interface GrupoBusca extends Grupo {
    _id: string;
}

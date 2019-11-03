import { RestauranteVotacao } from "./Restaurante";

export interface Votacao {
    status: boolean,
    restaurantes: RestauranteVotacao[] 
}
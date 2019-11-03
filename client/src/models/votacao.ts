import { RestauranteVotacao } from './restaurante';

export interface Votacao {
  status: boolean;
  restaurantes: RestauranteVotacao[];
}

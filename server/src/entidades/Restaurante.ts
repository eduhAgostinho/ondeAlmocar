export interface Restaurante {
    nome: string,
    endereco: string
}

export interface RestauranteVotacao {
    restaurante: RestauranteBusca
    curtidas: number,
    data: Date
}

export interface RestauranteBusca extends Restaurante {
    _id: string
}
import { Grupo } from "../entidades/Grupo";
import { buscarRestaurantes } from "../persistencia/restauranteRepositorio";
import { RestauranteVotacao } from "../entidades/Restaurante";

export async function criarCodigo(tamanho: number) {
    let resultado = '';
    let caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let tamanhoCaracteres = caracteres.length;
    for ( var i = 0; i < tamanho; i++ ) {
        resultado += caracteres.charAt(Math.floor(Math.random() * tamanhoCaracteres));
    }
    return resultado;
}

export async function novaVotacao(grupo: Grupo) {
    const ids: string[] = [];
    grupo.restaurantesEscolhidos.map( r => { ids.push(r._id) } );
    const restaurantes = await buscarRestaurantes(ids);
    const restaurantesParaVotacao: RestauranteVotacao[] = [];
    restaurantes.map( r => {
        restaurantesParaVotacao.push({ 
            curtidas: 0,
            data: new Date(),
            restaurante: r 
        });
    });
    return restaurantesParaVotacao;
}
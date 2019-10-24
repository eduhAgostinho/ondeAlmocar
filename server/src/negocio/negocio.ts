import { Grupo } from "../entidades/Grupo";
import { RestauranteVotacao } from "../entidades/Restaurante";
import * as restauranteRepositorio  from "../persistencia/restauranteRepositorio";

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
    const dataHoje = new Date();
    let contador = 0;
    grupo.restaurantesEscolhidos.map( r => {
        if (!(r.data.getFullYear() === dataHoje.getFullYear() && r.data.getMonth() === dataHoje.getMonth() &&
            r.data.getDate() >= dataHoje.getDate() - dataHoje.getDay())) {
            grupo.restaurantesEscolhidos.splice(contador, 1);
        } 
        contador++;
    });

    grupo.restaurantesEscolhidos.map( r => { ids.push(r.restaurante._id) } );
    const restaurantes = await restauranteRepositorio.buscarRestaurantes(ids);
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

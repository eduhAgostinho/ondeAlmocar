import { Grupo } from "../entidades/Grupo";
import { GrupoModel } from "./grupoModel";
import { criarCodigo, novaVotacao } from "../negocio/negocio";
import { RestauranteVotacao, Restaurante, RestauranteBusca } from "../entidades/Restaurante";
import { UsuarioModel } from "./usuarioModel";
import { RestauranteModel } from "./restauranteModel";

export async function grupoNovo(grupo: Grupo) {
    grupo.codigo = await criarCodigo(7);
    return GrupoModel.create(grupo);
}

export async function buscarGrupoID(grupoID: string ) {
    return GrupoModel.findById(grupoID).populate('integrantes').populate('restaurantesEscolhidos.restaurante').populate('votacao.restaurante').exec();
}

export async function novaVotacaoGrupo(grupoID: string) {
    const grupo = await buscarGrupoID(grupoID);
    if ( !grupo ) { return false };
    grupo.votacao = await novaVotacao(grupo);
    return grupo.save();
}

export async function atualizarGrupo(grupoID: string, restaurante: RestauranteBusca) {
    const grupo = await buscarGrupoID(grupoID);
    if ( !grupo ) { return false };
    grupo.restaurantesEscolhidos.push({data: new Date(), restaurante});
    return grupo.save();
}

export async function curtirRestaurante(idGrupo: string, idRestaurante: string) {
    const grupo = await GrupoModel.findById(idGrupo).exec();
    if (grupo) {
        grupo.votacao.map( r => { 
            if (r.restaurante._id == idRestaurante) {
                r.curtidas += 1;
            } 
        });
        return grupo.save();
    } else { return false; }
}
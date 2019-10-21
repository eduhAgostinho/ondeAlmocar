import { Grupo } from "../entidades/Grupo";
import { GrupoModel } from "./grupoModel";
import { criarCodigo, novaVotacao } from "../negocio/negocio";
import { RestauranteVotacao, Restaurante, RestauranteBusca } from "../entidades/Restaurante";
import { UsuarioModel } from "./usuarioModel";

export async function grupoNovo(grupo: Grupo) {
    grupo.codigo = await criarCodigo(7);
    return GrupoModel.create(grupo);
}

export async function buscarGrupoID(grupoID: string ) {
    return GrupoModel.findById(grupoID).populate('integrantes', UsuarioModel).exec();
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
    grupo.restaurantesEscolhidos.push(restaurante);
    return grupo.save();
}
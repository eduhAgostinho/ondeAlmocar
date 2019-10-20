import { Grupo } from "../entidades/Grupo";
import { GrupoModel } from "./grupoModel";
import { criarCodigo, novaVotacao } from "../negocio/negocio";
import { RestauranteVotacao } from "../entidades/Restaurante";

export async function novoGrupo(grupo: Grupo) {
    grupo.codigo = await criarCodigo(7);
    return GrupoModel.create(grupo);
}

export async function buscarGrupoID(grupoID: string ) {
    return GrupoModel.findById(grupoID).exec();
}

export async function novaVotacaoGrupo(grupoID: string) {
    const grupo = await buscarGrupoID(grupoID);
    if ( !grupo ) { return false };
    grupo.votacao = await novaVotacao(grupo);
    return grupo.save();
}

export async function atualizarGrupo(grupoID: string, restaurante: RestauranteVotacao) {
    const grupo = await buscarGrupoID(grupoID);
    if ( !grupo ) { return false };
    grupo.restaurantesEscolhidos.push(restaurante);
    return grupo.save();
}
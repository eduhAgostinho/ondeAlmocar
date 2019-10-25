import { Grupo } from "../entidades/Grupo";
import { GrupoModel } from "./grupoModel";
import * as Negocio from '../negocio/negocio';
import { RestauranteBusca } from "../entidades/Restaurante";
import { UsuarioModel } from "./usuarioModel";
import * as GrupoRespositorio from './grupoRepositorio';
import * as RestauranteRespositorio from './restauranteRepositorio';
import { RestauranteModel } from './restauranteModel';

export async function grupoNovo(grupo: Grupo) {
    grupo.codigo = await Negocio.criarCodigo(7);
    return GrupoModel.create(grupo);
}

export async function buscarGrupoID(grupoID: string ) {
    return GrupoModel.findById(grupoID).populate('restaurantesEscolhidos.restaurante').populate('votacao.restaurante').exec();
}

export async function novaVotacaoGrupo(grupoID: string) {
    const grupo = await GrupoRespositorio.buscarGrupoID(grupoID);
    if ( !grupo ) { return false };
    grupo.votacao = await Negocio.novaVotacao(grupo);
    return grupo.save();
}

export async function atualizarGrupo(grupoID: string, restaurante: any) {
    const grupo = await GrupoRespositorio.buscarGrupoID(grupoID);
    const restauranteQuery = await RestauranteRespositorio.buscarRestaurantePorId(restaurante._id);
    if ( !grupo && !restauranteQuery) { return false }
    grupo!.restaurantesEscolhidos.push({data: new Date(), restaurante: restauranteQuery!});
    return grupo!.save();
}

export async function curtirRestaurante(idGrupo: string, idRestaurante: string, idUsuario: string) {
    const grupo = await GrupoModel.findById(idGrupo).exec();
    const usuario = await UsuarioModel.findById(idUsuario).exec();
    if (!grupo || !usuario) {
        return false;
    } else {
        usuario.ultimoVoto = new Date();
        usuario.save();
        grupo.votacao.map( r => { 
            if (r.restaurante._id == idRestaurante) {
                r.curtidas += 1;
            } 
        });
        return grupo.save();
    }
}
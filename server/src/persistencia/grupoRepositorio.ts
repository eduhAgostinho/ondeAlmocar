import { Grupo } from "../entidades/Grupo";
import { GrupoModel } from "./grupoModel";
import * as Negocio from '../negocio/negocio';
import * as GrupoRepositorio from './grupoRepositorio';
import * as RestauranteRepositorio from './restauranteRepositorio';
import * as UsuarioRepositorio from './usuarioRepositorio';

export async function grupoNovo(grupo: Grupo) {
    grupo.codigo = await Negocio.criarCodigo(7);
    return GrupoModel.create(grupo);
}

export async function buscarGrupos() {
    return GrupoModel.find().populate('restaurantesEscolhidos.restaurante').populate('votacao.restaurantes').exec();
}

export async function buscarGrupoID(grupoID: string) {
    return GrupoModel.findById(grupoID).populate('restaurantesEscolhidos.restaurante').populate('votacao.restaurantes.restaurante').exec();
}

export async function novaVotacaoGrupo(grupoID: string) {
    const grupo = await GrupoRepositorio.buscarGrupoID(grupoID);
    if (!grupo) { return false };
    grupo.votacao.restaurantes = await Negocio.novaVotacao(grupo);
    grupo.votacao.status = true;
    return grupo.save();
}

export async function atualizarGrupo(grupoID: string, restauranteID: string) {
    const grupo = await GrupoRepositorio.buscarGrupoID(grupoID);
    const restauranteQuery = await RestauranteRepositorio.buscarRestaurantePorId(restauranteID);
    if (!grupo || !restauranteQuery) { return false; }
    grupo.restaurantesEscolhidos.push({ data: new Date(), restaurante: restauranteQuery });
    grupo.votacao.status = false;
    return grupo.save();
}

export async function curtirRestaurante(idGrupo: string, idRestaurante: string, idUsuario: string) {
    const grupo = await GrupoRepositorio.buscarGrupoID(idGrupo);
    const usuario = await UsuarioRepositorio.buscarUsuarioID(idUsuario);
    const dataAtual = new Date();
    if (!grupo || !usuario ||
        (usuario.ultimoVoto.getFullYear() === dataAtual.getFullYear() &&
            usuario.ultimoVoto.getMonth() === dataAtual.getMonth() &&
            usuario.ultimoVoto.getDate() === dataAtual.getDate()) ||
            !grupo.votacao
    ) { return false; }
    usuario.ultimoVoto = new Date();
    usuario.save();
    grupo.votacao.restaurantes.map(r => {
        if (r.restaurante._id == idRestaurante) {
            r.curtidas += 1;
        }
    });
    return grupo.save();
}
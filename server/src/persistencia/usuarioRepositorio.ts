import { Usuario } from "../entidades/Usuario";
import { UsuarioModel } from './usuarioModel';
import { hash } from 'bcrypt';
import { GrupoModel } from "./grupoModel";
import { GrupoBusca } from "../entidades/Grupo";
import * as UsuarioRepositorio from './usuarioRepositorio';
import * as GrupoRepositorio from './grupoRepositorio';

export async function novoUsuario(usuario: Usuario) {
    usuario.senha = await hash(usuario.senha, 10);
    return UsuarioModel.create(usuario);
}

export async function buscarUsuario(email: string) {
    return UsuarioModel.findOne().where('email').equals(email).populate('grupo', GrupoModel).exec();
}

export async function buscarUsuarioID(id: string) {
    return UsuarioModel.findById(id).exec();
}

export async function atualizarUsuario(email: string, grupo: GrupoBusca) {
    const usuario = await UsuarioRepositorio.buscarUsuario(email);
    const grupoResult = await GrupoRepositorio.buscarGrupoID(grupo._id) as GrupoBusca;
    if (!usuario || !grupoResult) { return false; }
    usuario.grupo = grupoResult;
    return usuario.save();
}
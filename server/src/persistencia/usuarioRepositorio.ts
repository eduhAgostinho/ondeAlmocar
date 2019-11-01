import { Usuario } from "../entidades/Usuario";
import { UsuarioModel } from './usuarioModel';
import * as Bcrypt from 'bcrypt';
import { GrupoModel } from "./grupoModel";
import { GrupoBusca } from "../entidades/Grupo";
import * as UsuarioRepositorio from './usuarioRepositorio';
import * as GrupoRepositorio from './grupoRepositorio';

export const bcrypt = Bcrypt;

export async function novoUsuario(usuario: Usuario) {
    const verif = await UsuarioRepositorio.buscarUsuario(usuario.email);
    if ( verif ) { return false; }
    usuario.senha = await bcrypt.hash(usuario.senha, 10);
    return UsuarioModel.create(usuario);
}

export async function buscarUsuario(email: string) {
    return UsuarioModel.findOne().where('email').equals(email).populate('grupo', GrupoModel).exec();
}

export async function buscarUsuarioID(id: string) {
    return UsuarioModel.findById(id).exec();
}

export async function atualizarUsuario(email: string, grupo: GrupoBusca | null) {
    const usuario = await UsuarioRepositorio.buscarUsuario(email);
    if(!usuario) { return false }
    if (grupo) {
        const grupoResult = await GrupoRepositorio.buscarGrupoID(grupo._id) as GrupoBusca;
        if (grupoResult) { return false; }
        usuario.grupo = grupoResult;
    } else {
        usuario.grupo = null;
    }
    return usuario.save();
}
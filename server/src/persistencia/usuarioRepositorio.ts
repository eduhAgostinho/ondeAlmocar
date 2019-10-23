import { Usuario } from "../entidades/Usuario";
import { UsuarioModel } from './usuarioModel';
import { hash } from 'bcrypt';
import { GrupoModel } from "./grupoModel";
import { buscarGrupoID } from "./grupoRepositorio";
import { Grupo, GrupoBusca } from "../entidades/Grupo";

export async function novoUsuario(usuario: Usuario) {
    usuario.senha  = await hash(usuario.senha, 10);
    return UsuarioModel.create(usuario);
}

export async function buscarUsuario(email: string) {
    return UsuarioModel.findOne().where('email').equals(email).populate('grupo', GrupoModel).exec();
}

export async function atualizarUsuario(email: string, grupo: GrupoBusca) {
    const usuario = await buscarUsuario(email);
    if (!usuario) { return false; }
    usuario.grupo = grupo;
    return usuario.save();
}
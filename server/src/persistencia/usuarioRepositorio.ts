import { Usuario } from "../entidades/Usuario";
import { UsuarioModel } from './usuarioModel';
import { hash } from 'bcrypt';
import { GrupoModel } from "./grupoModel";

export async function novoUsuario(usuario: Usuario) {
    usuario.senha  = await hash(usuario.senha, 10);
    return UsuarioModel.create(usuario);
}

export async function buscarUsuario(email: string) {
    return UsuarioModel.findOne().where('email').equals(email).populate('grupo', GrupoModel).exec();
}

export async function atualizarUsuario(email: string, user: Usuario) {
    const usuario = await buscarUsuario(email);
    if ( !usuario ) { return false; }
    usuario.grupo = user.grupo;
    return usuario.save();
}
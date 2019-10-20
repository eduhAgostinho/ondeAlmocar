import { Usuario } from "../entidades/Usuario";
import { UsuarioModel } from "./usuarioModel";
import { hash } from "bcrypt";

export async function novoUsuario(usuario: Usuario) {
    usuario.senha  = await hash(usuario.senha, 10);
    return UsuarioModel.create(usuario);
}

export async function buscarUsuarioId(email: string) {
    return UsuarioModel.findOne().where('email').equals(email).exec();
}

export async function atualizarUsuario(user: Usuario) {
    const usuario = await buscarUsuarioId(user.email);
    if ( !usuario ) { return false; }
    usuario.grupo = user.grupo;
    return usuario.save();
}
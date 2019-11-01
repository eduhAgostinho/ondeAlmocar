import { Grupo } from './grupo';

export interface UsuarioLogin {
    username: string;
    password: string;
}


export interface Usuario {
    email: string;
    senha: string;
    nome: string;
    grupo ?: Grupo;
    ultimoVoto ?: Date;
}

export interface UsuarioBusca extends Usuario {
    _id: string;
}


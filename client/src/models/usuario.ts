import { Grupo, GrupoBusca } from './grupo';

export interface UsuarioLogin {
    username: string;
    password: string;
}


export interface Usuario {
    email: string;
    senha: string;
    nome: string;
    grupo ?: GrupoBusca;
    ultimoVoto ?: Date;
    _id ?: string;
}

export interface UsuarioBusca extends Usuario {
    _id: string;
}


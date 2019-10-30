import { Grupo } from './grupo';

export interface Usuario {
    nome: string;
    email: string;
    grupo ?: Grupo;
    ultimoVoto ?: Date;
}

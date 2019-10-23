import { Grupo, GrupoBusca } from "./Grupo";

export interface Usuario {
    nome: string,
    email: string,
    senha: string,
    ultimoVoto: Date,
    grupo: GrupoBusca | null
}

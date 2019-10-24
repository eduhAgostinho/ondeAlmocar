import { Request, Response, NextFunction } from 'express';
import { Grupo } from '../entidades/Grupo';
import { grupoNovo, buscarGrupoID, atualizarGrupo, novaVotacaoGrupo, curtirRestaurante } from '../persistencia/grupoRepositorio';
import { RestauranteBusca } from '../entidades/Restaurante';

export async function novoGrupo(req: Request, res: Response, next: NextFunction) {
    try {
        const grupo = req.body as Grupo;
        await grupoNovo(grupo);
        res.status(201).send('Cadastrado com sucesso').end();
    } catch (err) {
        next(err);
    }    
}

export async function buscarGrupo(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const result = await buscarGrupoID(id);
        if ( result ) {
            res.json(result).end();
        } else {
            res.status(404).send('Grupo não encontrado').end();
        }
    } catch (err) {
        next(err);
    }
}

export async function novaVotacao(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const result = await novaVotacaoGrupo(id);
        if (result) {
            res.json(result).end();
        } else {
            res.status(400).send('Grupo não existe').end();
        }
    } catch (err) {
        next(err);
    }
}

export async function restauranteVisitado(req: Request, res: Response, next: NextFunction) {
    try {
        const restaurante = req.body as RestauranteBusca;
        const { id } = req.params;
        const result = await atualizarGrupo(id, restaurante);
        if ( result ) {
            res.send('Atualizado com sucesso').end();
        } else {
            res.status(400).send('Requisição inválida').end();
        }
    } catch (err) {
        next(err);
    }
}

export async function curtir(req: Request, res: Response, next: NextFunction) {
    try {
        const { idGrupo } = req.params;
        const { idRestaurante } = req.params;
        const { idUsuario } = req.params;
        const result = await curtirRestaurante(idGrupo, idRestaurante, idUsuario);
        if (result) {
            res.json(result).end();
        } else {
            res.status(400).send('Requisição inválida').end();
        }
    } catch (err) {
        next(err);
    }
}
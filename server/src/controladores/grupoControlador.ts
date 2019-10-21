import { Request, Response, NextFunction } from 'express';
import { Grupo } from '../entidades/Grupo';
import { grupoNovo } from '../persistencia/grupoRepositorio';

export async function novoGrupo(req: Request, res: Response, next: NextFunction) {
    try {
        const grupo = req.body as Grupo;
        await grupoNovo(grupo);
        res.status(201).send('Cadastrado com sucesso').end();
    } catch (err) {
        next(err);
    }    
}
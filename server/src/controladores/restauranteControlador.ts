import { Request, Response, NextFunction } from 'express';
import { Restaurante } from '../entidades/Restaurante';
import { novoRestaurante, buscarRestaurantes } from '../persistencia/restauranteRepositorio';

export async function restauranteNovo(req: Request, res: Response, next: NextFunction) {
    try {
        const restaurante = req.body as Restaurante;
        await novoRestaurante(restaurante);
        res.status(201).send('Cadastrado com sucesso').end();
    } catch (err) {
        next(err);
    }
} 


import { Request, Response, NextFunction } from 'express';
import { Usuario } from '../entidades/Usuario';
import { novoUsuario, buscarUsuario, atualizarUsuario } from '../persistencia/usuarioRepositorio';

export async function usuarioNovo(req: Request, res: Response, next: NextFunction) {
    try {
        const usuario = req.body as Usuario;
        await novoUsuario(usuario);
        res.status(201).send('Cadastrado com sucesso').end();
    } catch (err) {
        next(err);
    }
}

export async function buscarPorEmail(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await buscarUsuario(req.params.email);
        if (result) {
            res.json(result).end();
        } else {
            res.status(404).send('Usuário não encontrado').end();
        }
    } catch (err) {
        next(err);
    }
}

export async function atualizaUsuario(req: Request, res: Response, next: NextFunction) {
    try {
        const { email } = req.params;
        const usuario = req.body as Usuario;
        const result = await atualizarUsuario(email, usuario);
        if ( result ) {
            res.send('Atualizado com sucesso').end();
        } else {
            res.status(400).send('Usuário não encontrado').end();
        }

    } catch (err) {
        next(err);
    }
}
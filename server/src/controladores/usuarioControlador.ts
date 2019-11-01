import { Request, Response, NextFunction } from 'express';
import { Usuario } from '../entidades/Usuario';
import { novoUsuario, buscarUsuario, atualizarUsuario } from '../persistencia/usuarioRepositorio';
import jwt from 'jsonwebtoken';

export async function usuarioNovo(req: Request, res: Response, next: NextFunction) {
    try {
        const usuario = req.body as Usuario;
        const result = await novoUsuario(usuario);
        if (result) {
            const token = jwt.sign({user:{email: result.email, nome: result.nome}}, '9b7a699568708d417f18d41e4c6c06ba2d802a2f', { expiresIn: 86400});
            res.status(201).json({token}).send('Cadastrado com sucesso').end();
        } else {
            res.status(400).send('E-mail já cadastrado').end();
        }
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
        const { grupo } = req.body;
        const result = await atualizarUsuario(email, grupo);
        if ( result ) {
            res.json(result).end();
        } else {
            res.status(400).send('Requisição inválida');
        }

    } catch (err) {
        next(err);
    }
}

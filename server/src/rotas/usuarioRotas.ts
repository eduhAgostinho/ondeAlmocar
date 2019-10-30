import { Router } from "express";
import * as UsuarioControlador from '../controladores/usuarioControlador';
import passport from 'passport';
import jwt from 'jsonwebtoken';


export const router = Router();

router.post('/login', (req,res,next) => {
    passport.authenticate('login', (err,user,info) => {
        try {
            if (err || !user) {
                res.status(404).json(info);
                return next(err);
            }
            req.logIn(user, {session:false}, (err) => {
                if (err) {
                    res.status(404).json(info);
                    return next(err);
                }
                const token = jwt.sign({user:user}, '9b7a699568708d417f18d41e4c6c06ba2d802a2f', { expiresIn: 86400});
                return res.json({token});
            });
        }
        catch (error) {
            return next(error);
        }
    })(req,res,next);
});
router.get('/:email',  passport.authenticate('jwt', {session:false}), UsuarioControlador.buscarPorEmail);
router.put('', UsuarioControlador.usuarioNovo);
router.post('/:email',  passport.authenticate('jwt', {session:false}), UsuarioControlador.atualizaUsuario);
import { Router } from "express";
import * as GrupoControlador from '../controladores/grupoControlador';
import passport from 'passport';

export const router = Router();

router.put('', GrupoControlador.novoGrupo);
router.post('/votacao/:id', passport.authenticate('jwt', {session:false}), GrupoControlador.novaVotacao);
router.post('/:idGrupo/:idRestaurante', passport.authenticate('jwt', {session:false}), GrupoControlador.restauranteVisitado);
router.post('/:idGrupo/:idRestaurante/:idUsuario', passport.authenticate('jwt', {session:false}), GrupoControlador.curtir);
router.get('', passport.authenticate('jwt', {session:false}),GrupoControlador.buscarTodosGrupos);
router.get('/:id', passport.authenticate('jwt', {session:false}),GrupoControlador.buscarGrupo);
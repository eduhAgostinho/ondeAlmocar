import { Router } from "express";
import * as GrupoControlador from '../controladores/grupoControlador';

export const router = Router();

router.put('', GrupoControlador.novoGrupo);
router.post('/votacao/:id', GrupoControlador.novaVotacao);
router.post('/:idGrupo/:idRestaurante/:idUsuario', GrupoControlador.curtir);
router.post('/:id', GrupoControlador.restauranteVisitado);
router.get('/:id', GrupoControlador.buscarGrupo);
import { Router } from "express";
import * as GrupoControlador from '../controladores/grupoControlador';
import { GrupoModel } from "../persistencia/grupoModel";

export const router = Router();

router.put('', GrupoControlador.novoGrupo);
router.post('/votacao/:id', GrupoControlador.novaVotacao);
router.post('/:idGrupo/:idRestaurante', GrupoControlador.curtir);
router.post('/:id', GrupoControlador.restauranteVisitado);
router.get('/:id', GrupoControlador.buscarGrupo);
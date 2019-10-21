import { Router } from "express";
import * as GrupoControlador from '../controladores/grupoControlador';

export const router = Router();

router.put('', GrupoControlador.novoGrupo);
import { Router } from "express";
import * as UsuarioControlador from '../controladores/usuarioControlador';

export const router = Router();

router.get('/:email', UsuarioControlador.buscarPorEmail);
router.put('', UsuarioControlador.usuarioNovo);
router.post('/:email', UsuarioControlador.atualizaUsuario);
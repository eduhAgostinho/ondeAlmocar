import { Router } from "express";
import * as RestauranteControlador from '../controladores/restauranteControlador';

export const router = Router();

router.put('', RestauranteControlador.restauranteNovo );
router.get('/ids?', RestauranteControlador.restaurantes);
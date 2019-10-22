import { Router } from "express";
import * as GrupoControlador from '../controladores/grupoControlador';
import { GrupoModel } from "../persistencia/grupoModel";

export const router = Router();

router.put('', GrupoControlador.novoGrupo);
router.post('/votacao/:id', GrupoControlador.novaVotacao);
router.post('/:id', GrupoControlador.restauranteVisitado);
router.get('/edu', async (req, res, next) => {
    const a = await GrupoModel.find({'votacao._id': '5daf620d3576923c203f52e0' }).exec();
    a[0].votacao.find( r => { 
        console.log(r);
        
        if (r.restaurante._id === '5dadc95a39daab20d0147fff') {
            console.log(r);
        } else {
            console.log('oi');
        }
    });
    res.json(a);
})
router.get('/:id', GrupoControlador.buscarGrupo);
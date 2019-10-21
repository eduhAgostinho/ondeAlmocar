import express from 'express';
import bodyParser from 'body-parser';
import errorhandler from 'errorhandler';
import cors from 'cors';
import { router as routerUsuario } from './rotas/usuarioRotas';
import { router as routerGrupo } from './rotas/grupoRotas';
import { router as routerRestaurante } from './rotas/restauranteRotas';

const app = express();

app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended: false } ));
app.use(cors());
app.use('/usuario', routerUsuario);
app.use('/grupo', routerGrupo);
app.use('/restaurante', routerRestaurante);
if (process.env.NODE_ENV !== "production") {
    app.use(errorhandler());
} 
export default app;
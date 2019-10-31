import request from 'supertest';
import app from '../app';
import { connect } from 'mongoose';
import * as GrupoRepositorios from '../persistencia/grupoRepositorio';
import * as UsuarioRepositorio from '../persistencia/usuarioRepositorio';
import { Usuario } from '../entidades/Usuario';
import { Grupo } from '../entidades/Grupo';
import { Restaurante, RestauranteBusca } from '../entidades/Restaurante';
import { novoRestaurante } from '../persistencia/restauranteRepositorio';
import { ObjectID } from 'bson';

let cliente = require('mongoose');
let token: string;
let res: any
let novoGrupo: Grupo = {
    nome: 'Restaurante Teste',
    restaurantesEscolhidos: [],
    votacao: []
}
let restaurante: Restaurante = {
    nome: 'Restaurante Teste',
    endereco: 'Rua Teste'
}

beforeAll(async () => {
    jest.setTimeout(50000);
    // const url = `mongodb+srv://${process.env.MONGO_HOST}:${process.env.MONGO_PASSWORD}@cluster0-wqeu2.mongodb.net/${process.env.MONGO_DATABASETESTGRUPO}?retryWrites=true&w=majority`;
    const url = `mongodb://${process.env.MONGO_LOCAL}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASETESTGRUPO}`;
    cliente = await connect(url, { useCreateIndex: true, useNewUrlParser: true });

    const admin: Usuario = {
        email: 'usuarioTest@email.com',
        senha: 'senhaTeste',
        grupo: null,
        nome: 'John Doe',
        ultimoVoto: new Date(2019, 5, 24)
    };
    await request(app).put('/usuario').send(admin);
    res = await request(app).post('/usuario/login').send({
        username: 'usuarioTest@email.com',
        password: 'senhaTeste'
    });
    token = res.body.token;
})

afterAll(() => {
    cliente.connection.db.dropDatabase();
    cliente.connection.close();
});

describe('Teste de rotas para grupoControlador', () => {
    describe('novoGrupo', () => {
        it('PUT /Insere um novo Grupo no banco de dados e responde a requisição com status 201', async () => {
            //Act 
            const resposta = await request(app).put('/grupo').send(novoGrupo);

            //Assert
            expect(resposta.status).toBe(201);
        });

        it('PUT /Insere um Grupo inválido no banco de dados e responde a requisição com status 500', async () => {
            //Act 
            const resposta = await request(app).put('/grupo').send();

            //Assert
            expect(resposta.status).toBe(500);
        });

    });

    describe('buscarGrupo', () => {
        it('GET /Busca Grupo pelo ID e retorna status 200 OK', async () => {
            //Arrange
            const grupoNovo = await GrupoRepositorios.grupoNovo(novoGrupo);

            //Act
            const resposta = await request(app).get(`/grupo/${grupoNovo._id}`).set('Authorization', `bearer ${token}`);

            //Assert
            expect(resposta.status).toBe(200);
            expect(resposta.body.nome).toBe('Restaurante Teste');
        });

        it('GET /Busca Grupo inexistente e retorna status 404', async () => {
            //Act
            const resposta = await request(app).get(`/grupo/5dadc64c4063850a4411f6ad`).set('Authorization', `bearer ${token}`);

            //Assert
            expect(resposta.status).toBe(404);
            expect(resposta.body.nome).toBeUndefined();
        });


        it('GET /Busca Grupo com ID inválido e retorna status 500', async () => {
            //Act
            const resposta = await request(app).get(`/grupo/idinvalido`).set('Authorization', `bearer ${token}`);

            //Assert
            expect(resposta.status).toBe(500);
            expect(resposta.body.nome).toBeUndefined();
        });
    });

    describe('novaVotacao', () => {
        it('POST /Recebe um ID de um grupo, inicia uma nova votação e retorna status 200 OK', async () => {
            //Arrange
            const grupoNovo = await GrupoRepositorios.grupoNovo(novoGrupo);
            await novoRestaurante(restaurante);

            //Act
            const resposta = await request(app).post(`/grupo/votacao/${grupoNovo._id}`).set('Authorization', `bearer ${token}`);

            //Assert
            expect(resposta.status).toBe(200);
            expect(resposta.body.votacao.length).toEqual(1);
        });

        it('POST /Recebe um ID de um Grupo inexistente e retorna status 400', async () => {
            //Arrange
            const id = new ObjectID();

            //Act
            const resposta = await request(app).post(`/grupo/votacao/${id}`).set('Authorization', `bearer ${token}`);

            //Assert
            expect(resposta.status).toBe(400);
            expect(resposta.body.votacao).toBeUndefined();
        });

        it('POST /Recebe um ID inválido de um Grupo e retorna status 500', async () => {
            //Act
            const resposta = await request(app).post(`/grupo/votacao/idInvalido`).set('Authorization', `bearer ${token}`);

            //Assert
            expect(resposta.status).toBe(500);
            expect(resposta.body.votacao).toBeUndefined();
        });
    });

    describe('restauranteVisitado', () => {
        it('POST /Recebe um ID de um Grupo e adiciona na lista de visitados na semana, um Restaurante novo', async () => {
            //Arrange
            const grupoNovo = await GrupoRepositorios.grupoNovo(novoGrupo);
            const restauranteNovo = await novoRestaurante(restaurante);

            //Act
            const resposta = await request(app).post(`/grupo/${grupoNovo._id}`).send(restauranteNovo).set('Authorization', `bearer ${token}`);

            //Assert
            expect(resposta.status).toBe(200);
            expect(JSON.stringify(resposta.body.restaurantesEscolhidos[0].restaurante)).toEqual(JSON.stringify(restauranteNovo as RestauranteBusca));
        });

        it('POST /Recebe um ID de um Grupo inexistente e retorna status 400', async () => {
            //Arrange
            const id = new ObjectID();
            const restauranteNovo = await novoRestaurante(restaurante);

            //Act
            const resposta = await request(app).post(`/grupo/${id}`).send(restauranteNovo).set('Authorization', `bearer ${token}`);

            //Assert
            expect(resposta.status).toBe(400);
            expect(resposta.text).toBe('Requisição inválida');
        });
    });

    describe('curtir', () => {
        it('POST /Recebe ID de um Grupo, Usuario e Restaurante e acrescenta mais uma curtida retornando status 200', async () => {
            //Arrange
            const restauranteNovo = await novoRestaurante(restaurante);
            novoGrupo.votacao.push({ data: new Date(), curtidas: 0, restaurante: restauranteNovo });
            const grupoNovo = await GrupoRepositorios.grupoNovo(novoGrupo);
            const usuario: Usuario = {
                email: 'teste@email.com',
                senha: 'senha123',
                grupo: grupoNovo,
                nome: 'John Doe',
                ultimoVoto: new Date(2019, 5, 24)
            };
            const hoje = new Date();
            let usuarioNovo: any = await UsuarioRepositorio.novoUsuario(usuario);

            //Act
            const resposta = await request(app).post(`/grupo/${grupoNovo._id}/${restauranteNovo._id}/${usuarioNovo._id}`).set('Authorization', `bearer ${token}`);
            usuarioNovo = await UsuarioRepositorio.buscarUsuarioID(usuarioNovo._id);

            //Assert
            expect(resposta.status).toBe(200);
            expect(resposta.body.votacao[0].curtidas).toBe(1);
            expect(usuarioNovo.ultimoVoto.getDate()).toBe(hoje.getDate());
            expect(usuarioNovo.ultimoVoto.getMonth()).toBe(hoje.getMonth());
            expect(usuarioNovo.ultimoVoto.getFullYear()).toBe(hoje.getFullYear());
        });

        it('POST /Recebe ID de um Grupo, Usuario e Restaurante inexistentes e retorna status 400', async () => {
            //Arrange
            const id = new ObjectID();

            //Act
            const resposta = await request(app).post(`/grupo/${id}/${id}/${id}`).set('Authorization', `bearer ${token}`);

            //Assert
            expect(resposta.status).toBe(400);

        });

        it('POST /Recebe ID de um Grupo, Usuario e Restaurante inválidos e retorna status 500', async () => {
            //Arrange
            const id = 'IDInválido';
            
            //Act
            const resposta = await request(app).post(`/grupo/${id}/${id}/${id}`).set('Authorization', `bearer ${token}`);

            //Assert
            expect(resposta.status).toBe(500);
        });
    });

});
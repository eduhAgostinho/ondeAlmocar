import request from 'supertest';
import app from '../app';
import { connect } from 'mongoose';
import * as GrupoRepositorios from '../persistencia/grupoRepositorio';
import { Usuario } from '../entidades/Usuario';
import { Grupo } from '../entidades/Grupo';
import { Restaurante } from '../entidades/Restaurante';
import { novoRestaurante } from '../persistencia/restauranteRepositorio';

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
    // const url = `mongodb+srv://${process.env.MONGO_HOST}:${process.env.MONGO_PASSWORD}@cluster0-wqeu2.mongodb.net/${process.env.MONGO_DATABASETEST}?retryWrites=true&w=majority`;
    const url = `mongodb://${process.env.MONGO_LOCAL}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASETEST}`;
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
    jest.setTimeout(50000);

})

afterEach(() => {
    // cliente.connection.collection('Grupo').drop();
});

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
        it('POST /', async () => {
            //Arrange
            const grupoNovo = await GrupoRepositorios.grupoNovo(novoGrupo);
            await novoRestaurante(restaurante);

            //Act
            const resposta = await request(app).post(`/grupo/votacao/${grupoNovo._id}`).set('Authorization', `bearer ${token}`);

            //Assert
            expect(resposta.status).toBe(200);
            expect(resposta.body.votacao.length).toEqual(1);
        });
    });

});
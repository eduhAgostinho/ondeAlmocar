import request from 'supertest';
import app from '../app';
import { connect } from 'mongoose';
import * as UsuarioRepositorio from '../persistencia/usuarioRepositorio';
import * as GrupoRepositorio from '../persistencia/grupoRepositorio';
import { Usuario } from '../entidades/Usuario';
import { Grupo } from '../entidades/Grupo';

let cliente = require('mongoose');
let token: string;
let res: any

let novoGrupo: Grupo = {
    nome: 'Restaurante Teste',
    restaurantesEscolhidos: [],
    votacao: []
}

const novoUsuario: Usuario = {
    nome: 'Jane Doe',
    email: 'JaneDoe@email.com',
    senha: 'senha123',
    ultimoVoto: new Date(),
    grupo: null
}

beforeAll(async () => {
    jest.setTimeout(50000);
    const url = `mongodb+srv://${process.env.MONGO_HOST}:${process.env.MONGO_PASSWORD}@cluster0-wqeu2.mongodb.net/${process.env.MONGO_DATABASETESTUSUARIO}?retryWrites=true&w=majority`;
    // const url = `mongodb://${process.env.MONGO_LOCAL}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASETESTUSUARIO}`;
    cliente = await connect(url, { useCreateIndex: true, useNewUrlParser: true });

    const admin: Usuario = {
        email: 'usuarioTest@email.com',
        senha: 'senhaTeste',
        grupo: null,
        nome: 'John Doe',
        ultimoVoto: new Date(2019, 5, 24)
    };
    await request(app).put('/usuario').send(admin);
    const res = await request(app).post('/usuario/login').send({
        username: 'usuarioTest@email.com',
        password: 'senhaTeste'
    });
    token = res.body.token;
});

afterAll(() => {
    cliente.connection.db.dropDatabase();
    cliente.connection.close();
});

describe('Teste de rotas para usuarioControlador', () => {
    describe('usuarioNovo', () => {
        it('PUT /Recebe um Usuario e o cadastra no banco de dados retornando status 201 ', async () => {
            //Act
            const resposta = await request(app).put('/usuario').send(novoUsuario);

            //Assert
            expect(resposta.status).toBe(201);
        });

        it('PUT /Recebe Usuario inválido e retorna status 500', async () => {
            //Act
            const resposta = await request(app).put('/usuario').send();

            //Assert
            expect(resposta.status).toBe(500);
        });

        it('Tenta cadastrar Usuario com e-mail já cadastrado e retorna status 400', async () => {
            //Act
            novoUsuario.email = 'emailUsado@email.com';
            await UsuarioRepositorio.novoUsuario(novoUsuario);
            const resposta = await request(app).put('/usuario').send(novoUsuario);

            //Assert
            expect(resposta.status).toBe(400);
        });
    });

    describe('buscarPorEmail', () => {
        it('GET /Busca Usuario pelo email e retorna status 200', async () => {
            //Act
            const novoUsuario: Usuario = {
                nome: 'John Doe',
                email: 'JohnDoe@email.com',
                senha: 'senha123',
                ultimoVoto: new Date(),
                grupo: null
            };
            const user = await UsuarioRepositorio.novoUsuario(novoUsuario);

            //Act
            const resposta = await request(app).get(`/usuario/${novoUsuario.email}`).set('Authorization', `bearer ${token}`);

            //Assert
            expect(resposta.status).toBe(200);
            expect(JSON.stringify(resposta.body)).toEqual(JSON.stringify(user));
        });

        it('GET /Busca por email um Usuario inexistente e retorna status 404', async () => {
            //Act
            const resposta = await request(app).get('/usuario/email@email.com').set('Authorization', `bearer ${token}`);

            //Assert
            expect(resposta.status).toBe(404);
        });
    });

    describe('atualizaUsuario', () => {
        it('POST /Recebe ID de um Usuario e o atualiza com um grupo novo recebido no corpo da requisição retornando status 200', async () => {
            //Arrange
            novoUsuario.email = 'novoEmail@email.com';
            const usuarioNovo = await UsuarioRepositorio.novoUsuario(novoUsuario);
            const grupoNovo = await GrupoRepositorio.grupoNovo(novoGrupo);

            //Act
            const resposta = await request(app).post(`/usuario/${novoUsuario.email}`).send(grupoNovo).set('Authorization', `bearer ${token}`);

            //Assert
            expect(resposta.status).toBe(200);
            expect(JSON.stringify(resposta.body.grupo)).toEqual(JSON.stringify(grupoNovo));
        });

        it('POST /Recebe email de um usuario inexistente e retorna status 404', async () => {
            //Arrange
            const grupoNovo = await GrupoRepositorio.grupoNovo(novoGrupo);

            //Act
            const resposta = await request(app).post(`/usuario/email@email.com`).send(grupoNovo).set('Authorization', `bearer ${token}`);

            //Assert
            expect(resposta.status).toBe(400);
            expect(resposta.text).toEqual('Requisição inválida');
        });

    });
});
import request from 'supertest';
import app from '../app';
import { connect } from 'mongoose';
import * as GrupoRepositorios from '../persistencia/grupoRepositorio';
import { Usuario } from '../entidades/Usuario';
import { Grupo } from '../entidades/Grupo';

let cliente = require('mongoose');
let token: string;
let res:any
let novoGrupo: Grupo = {
    codigo: 'ABf5aA7',
    nome: 'Restaurante Teste',
    restaurantesEscolhidos: [],
    votacao: []
}

beforeAll(async () => {
    console.log(process.env.MONGO_HOST);
    // const url = `mongodb+srv://${process.env.ATLAS_USER}:${process.env.ATLAS_PASSWORD}@${process.env.ATLAS_CLUSTER}/${ATLAS_DATABASE}?retryWrites=true&w=majority`;
    const url = `mongodb+srv://${process.env.MONGO_HOST}:${process.env.MONGO_PASSWORD}@cluster0-wqeu2.mongodb.net/${process.env.MONGO_DATABASETEST}?retryWrites=true&w=majority`;
    cliente = await connect(url, { useCreateIndex: true, useNewUrlParser: true });
    // const admin: Usuario = {
    //     email: 'usuarioTest@email.com',
    //     senha : 'admin',
    //     grupo: null,
    //     nome: 'John Doe',
    //     ultimoVoto: new Date(2019,5,24)
    // };
    // await request(app).put('/criar').send(admin);
    // res = await request(app).post('/login').send({
    //   username: 'admin',
    //   password: 'admin'
    // });
    // token = res.body.token;
    jest.setTimeout(50000);
})

afterEach(() => {
    cliente.connection.db.dropDatabase();
});

afterAll(() => {
    cliente.connection.close();
});

describe('Teste de rotas para grupoControlador', () => {
    it('PUT /Teste rota inserindo um novo Grupo no banco de dados e responde a requisicao com 200 OK', async () => {
        //Act 
        const resposta = await request(app).put('/grupo').send(novoGrupo);

        //Assert
        expect(resposta.status).toBe(201);

    });
});
import { Restaurante } from "../entidades/Restaurante";
import request from 'supertest';
import app from '../app';
import { connect } from 'mongoose';
import { Usuario } from "../entidades/Usuario";
let cliente = require('mongoose');

let restaurante: Restaurante = {
    nome: 'Restaurante Assis Brasil',
    endereco: 'Av. Assis Brasil'
}

beforeAll(async () => {
    jest.setTimeout(50000);
    const url = `mongodb+srv://${process.env.MONGO_HOST}:${process.env.MONGO_PASSWORD}@cluster0-wqeu2.mongodb.net/${process.env.MONGO_DATABASETESTRESTAURANTE}?retryWrites=true&w=majority`;
    // const url = `mongodb://${process.env.MONGO_LOCAL}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASETESTRESTAURANTE}`;
    cliente = await connect(url, { useCreateIndex: true, useNewUrlParser: true });

    const admin: Usuario = {
        email: 'usuarioTest@email.com',
        senha: 'senhaTeste',
        grupo: null,
        nome: 'John Doe',
        ultimoVoto: new Date(2019, 5, 24)
    };
    await request(app).put('/usuario').send(admin);
    await request(app).post('/usuario/login').send({
        username: 'usuarioTest@email.com',
        password: 'senhaTeste'
    });
});

afterAll(() => {
    cliente.connection.db.dropDatabase();
    cliente.connection.close();
});

describe('Teste de rotas para restauranteControlador', () => {
    describe('restauranteNovo', () => {
        it('PUT /Recebe um Restaurante, cadastra no banco de dados e retorna status 201', async () => {
            //Act
            const resultado = await request(app).put('/restaurante').send(restaurante);

            //Assert
            expect(resultado.status).toBe(201);
        });

        it('PUT /Recebe um Resturante inválido e retorna status 500', async () => {
             //Act
             const resultado = await request(app).put('/restaurante').send();

             //Assert
             expect(resultado.status).toBe(500);
        })
    });
})
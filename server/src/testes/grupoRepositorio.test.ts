import * as GrupoModule from '../persistencia/grupoModel';
import * as UsuarioModule from '../persistencia/usuarioModel';
import * as RepositorioGrupo from '../persistencia/grupoRepositorio';
import * as RestauranteRepositorio from '../persistencia/restauranteRepositorio';
import * as NegocioModule from '../negocio/negocio';
import * as RepositorioUsuario from '../persistencia/usuarioRepositorio';

import { Grupo } from '../entidades/Grupo';
import { RestauranteVotacao, RestauranteBusca } from '../entidades/Restaurante';
import { RestauranteModel } from "../persistencia/restauranteModel";
import { Usuario } from '../entidades/Usuario';

let grupoTeste: Grupo = {
    codigo: 'ABf5aA7',
    nome: 'Restaurante Teste',
    restaurantesEscolhidos: [],
    votacao: { status: false, restaurantes: [] }
}

let restaurantes: RestauranteBusca[] = [
    { nome: 'Restaurante1', endereco: 'Rua Teste, 422', _id: 'id1' },
    { nome: 'Restaurante2', endereco: 'Av. Ipiranga, 120 - Porto Alegre', _id: 'id2' }
];
let restaurantesVotacao: RestauranteVotacao[] = [
    { data: new Date(), curtidas: 0, restaurante: restaurantes[0] },
    { data: new Date(), curtidas: 0, restaurante: restaurantes[1] }
];

let usuario: Usuario = {
    email: 'usuario@email.com',
    grupo: null,
    nome: 'John Doe',
    senha: 'senha',
    ultimoVoto: new Date(2019,1,15)
}

describe('Testes em GrupoRepositorio', () => {

    afterEach(() => {
        grupoTeste = {
            codigo: 'ABf5aA7',
            nome: 'Restaurante Teste',
            restaurantesEscolhidos: [],
            votacao: { status: false, restaurantes: [] }
        }
    });
    describe('grupoNovo -', () => {
        it(' Recebe um Grupo como argumento e chamar GrupoModel.create e criarCodigo', async () => {
            //Arrange
            const GrupoModel = GrupoModule.GrupoModel;
            const Negocio = NegocioModule;
            Negocio.criarCodigo = jest.fn().mockReturnValue('aGb7da');
            GrupoModel.create = jest.fn().mockReturnValue(grupoTeste);

            //Act
            const result = await RepositorioGrupo.grupoNovo(grupoTeste);

            //Assert
            expect(result).toEqual(grupoTeste);
            expect(GrupoModel.create).toBeCalledTimes(1);
            expect(Negocio.criarCodigo).toBeCalledTimes(1);
        });
    });

    describe('novaVotacaoGrupo -', () => {
        it('Recebe como argumento ID de um Grupo e o retorna com uma votação nova', async () => {
            //Arrange
            let GrupoRepositorio = RepositorioGrupo;
            let Negocio = NegocioModule;
            const grupo = new GrupoModule.GrupoModel();
            GrupoRepositorio.buscarGrupoID = jest.fn().mockReturnValue(grupo);
            grupo.save = jest.fn().mockReturnValue(grupo);
            Negocio.novaVotacao = jest.fn().mockReturnValue(restaurantesVotacao);

            //Act
            const resultado = await GrupoRepositorio.novaVotacaoGrupo('idGrupo');

            //Assert
            expect(resultado).toEqual(grupo);
            expect(Negocio.novaVotacao).toBeCalledTimes(1);
            expect(grupo.save).toBeCalledTimes(1);
        });

        it('Recebe como argumento ID de um grupo inexistente e retorna falso', async () => {
            //Arrange
            let GrupoRepositorio = RepositorioGrupo;
            let Negocio = NegocioModule;
            const grupo = new GrupoModule.GrupoModel();
            grupo.save = jest.fn().mockReturnValue(grupo);
            GrupoRepositorio.buscarGrupoID = jest.fn().mockReturnValue(false);
            Negocio.novaVotacao = jest.fn().mockReturnValue(restaurantesVotacao);

            //Act 
            const resultado = await GrupoRepositorio.novaVotacaoGrupo('IDinvalido');

            //Assert
            expect(resultado).toBe(false);
            expect(Negocio.novaVotacao).toBeCalledTimes(0);
            expect(grupo.save).toBeCalledTimes(0);
        });

        describe('atualizarGrupo', () => {
            it('Recebe um ID de um grupo e um Restaurante e o acrescenta como já visitado', async () => {
                //Arrange                
                let GrupoRepositorio = RepositorioGrupo;
                let Repositoriorestaurante = RestauranteRepositorio;
                grupoTeste.votacao.status = true;
                const grupo = new GrupoModule.GrupoModel(grupoTeste);
                const rest = new RestauranteModel(restaurantes[0]);
                GrupoRepositorio.buscarGrupoID = jest.fn().mockReturnValue(grupo);
                Repositoriorestaurante.buscarRestaurantePorId = jest.fn().mockReturnValue(rest);
                grupo.save = jest.fn().mockReturnValue(grupo);

                //Act 
                const resultado = await GrupoRepositorio.atualizarGrupo('idGrupo', rest._id);

                //Assert
                expect(resultado).toEqual(grupo);
                expect(grupo.restaurantesEscolhidos.length).toEqual(1);
                expect(grupo.restaurantesEscolhidos[0].restaurante).toStrictEqual(rest);
            });

            it('Recebe um ID de um grupo inexistente e um Restaurante e retorna falso', async () => {
                //Arrange                
                let GrupoRepositorio = RepositorioGrupo;
                let RepositorioRestaurante = RestauranteRepositorio;
                const grupo = new GrupoModule.GrupoModel(grupoTeste);
                const rest = new RestauranteModel(restaurantes[0]);
                RepositorioRestaurante.buscarRestaurantePorId = jest.fn().mockReturnValue(rest);
                GrupoRepositorio.buscarGrupoID = jest.fn().mockReturnValue(false);
                grupo.save = jest.fn().mockReturnValue(grupo);
               
                //Act 
                const resultado = await GrupoRepositorio.atualizarGrupo('idGrupo', rest._id);

                //Assert
                expect(resultado).toEqual(false);
                expect(grupo.restaurantesEscolhidos.length).toEqual(0);
                expect(grupo.save).toBeCalledTimes(0);
            });
        });

        describe('curtirRestaurante', () => {
            let GrupoRepositorio = RepositorioGrupo;
            let UsuarioRepositorio = RepositorioUsuario;
            const dataAtual = new Date();
            
            beforeEach(() => {
                grupoTeste.votacao = { status: false, restaurantes: [] };
            });
            
            it('Recebe um ID de um Grupo, de um Restaurante e de um Usuario e acrescenta mais uma curtida no restaurante informado', async () => {
                //Arrange
                const user = new UsuarioModule.UsuarioModel(usuario);
                const rest = new RestauranteModel(restaurantes[0]);
                grupoTeste.votacao.status = true;
                grupoTeste.votacao.restaurantes.push({ curtidas: 0, data: dataAtual, restaurante: rest });
                const grupo = new GrupoModule.GrupoModel(grupoTeste);
                GrupoRepositorio.buscarGrupoID = jest.fn().mockReturnValue(grupo);
                UsuarioRepositorio.buscarUsuarioID = jest.fn().mockReturnValue(user);
                user.save = jest.fn();
                grupo.save = jest.fn().mockReturnValue(grupo);

                //Act
                const resultado = await GrupoRepositorio.curtirRestaurante('idGrupo', rest._id, 'IdUsuario');

                //Assert
                expect(resultado).toBeTruthy();
                expect(grupo.votacao.restaurantes[0].curtidas).toEqual(1);
                expect(user.save).toBeCalledTimes(1);
                expect(grupo.save).toBeCalledTimes(1);
            });

            it('Recebe um ID de um Grupo inexistente e retorna falso', async () => {
                //Arrange
                const user = new UsuarioModule.UsuarioModel(usuario);
                const rest = new RestauranteModel(restaurantes[0]);
                grupoTeste.votacao.status = true;
                grupoTeste.votacao.restaurantes.push({ curtidas: 0, data: dataAtual, restaurante: rest });
                const grupo = new GrupoModule.GrupoModel(grupoTeste);
                GrupoRepositorio.buscarGrupoID = jest.fn().mockReturnValue(false);
                UsuarioRepositorio.buscarUsuarioID = jest.fn().mockReturnValue(user);
                user.save = jest.fn();
                grupo.save = jest.fn().mockReturnValue(grupo);

                //Act
                const resultado = await GrupoRepositorio.curtirRestaurante('idGrupoInexistente', rest._id, 'IdUsuario');

                //Assert
                expect(resultado).toBeFalsy();
                expect(user.save).toBeCalledTimes(0);
                expect(grupo.save).toBeCalledTimes(0);
                expect(grupo.votacao.restaurantes[0].curtidas).toEqual(0);
            });
        });
    });
});
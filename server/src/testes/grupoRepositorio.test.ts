
import * as GrupoModule from '../persistencia/grupoModel';
import * as NegocioModule from '../negocio/negocio';
import * as GrupoRepositorio from '../persistencia/grupoRepositorio';
import * as RestauranteRespositorio from '../persistencia/restauranteRepositorio';

import { Grupo } from '../entidades/Grupo';
import { RestauranteVotacao, RestauranteBusca } from '../entidades/Restaurante';
import { RestauranteModel } from "../persistencia/restauranteModel";

let grupo: Grupo = {
    codigo: 'ABf5aA7',
    nome: 'Restaurante Teste',
    restaurantesEscolhidos: [],
    votacao: []
}
let restaurantes: RestauranteBusca[] = [
    { nome: 'Restaurante1', endereco: 'Rua Teste, 422', _id: 'id1' },
    { nome: 'Restaurante2', endereco: 'Av. Ipiranga, 120 - Porto Alegre', _id: 'id2' }
];
let restaurantesVotacao: RestauranteVotacao[] = [
    { data: new Date(), curtidas: 0, restaurante: restaurantes[0] },
    { data: new Date(), curtidas: 0, restaurante: restaurantes[1] }
];
describe('Testes em GrupoRepositorio', () => {

    afterAll(() => {
        grupo = {
            codigo: 'ABf5aA7',
            nome: 'Restaurante Teste',
            restaurantesEscolhidos: [],
            votacao: []
        }
    });
    describe('grupoNovo -', () => {
        it(' Recebe um Grupo como argumento e chamar GrupoModel.create e criarCodigo', async () => {
            //Arrange
            const GrupoModel = GrupoModule.GrupoModel;
            const Negocio = NegocioModule;
            Negocio.criarCodigo = jest.fn().mockReturnValue('aGb7da');
            GrupoModel.create = jest.fn().mockReturnValue(grupo);

            //Act
            const result = await GrupoRepositorio.grupoNovo(grupo);

            //Assert
            expect(result).toEqual(grupo);
            expect(GrupoModel.create).toBeCalledTimes(1);
            expect(Negocio.criarCodigo).toBeCalledTimes(1);
        });
    });

    describe('novaVotacaoGrupo -', () => {
        it('Recebe como argumento ID de um Grupo e o retorna com uma votação nova', async () => {
            //Arrange
            let GrupoRepositorioA = GrupoRepositorio;
            let Negocio = NegocioModule;
            const grupo = new GrupoModule.GrupoModel();
            GrupoRepositorioA.buscarGrupoID = jest.fn().mockReturnValue(grupo);
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
            let GrupoRepositorioA = GrupoRepositorio;
            let Negocio = NegocioModule;
            const grupo = new GrupoModule.GrupoModel();
            grupo.save = jest.fn().mockReturnValue(grupo);
            GrupoRepositorioA.buscarGrupoID = jest.fn().mockReturnValue(false);
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
                let GrupoRepositorioA = GrupoRepositorio;
                let Repositoriorestaurante = RestauranteRespositorio;

                const grupo = new GrupoModule.GrupoModel();
                GrupoRepositorioA.buscarGrupoID = jest.fn().mockReturnValue(grupo);
                Repositoriorestaurante.buscarRestaurantePorId = jest.fn().mockReturnValue(restaurantes[0]);

                grupo.save = jest.fn().mockReturnValue(grupo);

                //Act 
                const resultado = await GrupoRepositorio.atualizarGrupo('idGrupo', restaurantes[0]);

                //Assert
                expect(resultado).toEqual(grupo);
                expect(grupo.restaurantesEscolhidos.length).toEqual(1);
                console.log(restaurantes[0]);
                console.log(grupo); 
                // expect(grupo.restaurantesEscolhidos[0].restaurante).toStrictEqual(restaurantes[0]);
            });

            // it('Recebe um ID de um grupo inexistente e um Restaurante e retorna falso', async () => {
            //     //Arrange                
            //     let GrupoRepositorioA = GrupoRepositorio;
            //     let Repositoriorestaurante = RestauranteRespositorio;
            //     const grupo = new GrupoModule.GrupoModel();
            //     Repositoriorestaurante.buscarRestaurantePorId = jest.fn().mockReturnValue(restaurantes[0]);
            //     GrupoRepositorioA.buscarGrupoID = jest.fn().mockReturnValue(false);
            //     grupo.save = jest.fn().mockReturnValue(grupo);
            //     //Act 
            //     const resultado = await GrupoRepositorio.atualizarGrupo('idGrupo', restaurantes[0]);

            //     //Assert
            //     expect(resultado).toEqual(false);
            //     // expect(grupo.restaurantesEscolhidos.length).toEqual(1);
            //     // expect(grupo.save).toBeCalledTimes(0);
            // });
        });
    });

});
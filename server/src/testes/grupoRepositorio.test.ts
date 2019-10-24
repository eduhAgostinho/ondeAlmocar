
import * as GrupoModule from '../persistencia/grupoModel';
import * as NegocioModule from '../negocio/negocio';
import * as GrupoRepositorio from '../persistencia/grupoRepositorio';
import { Grupo } from '../entidades/Grupo';
import { RestauranteVotacao, RestauranteBusca } from '../entidades/Restaurante';
import { Document } from 'mongoose';

describe('Testes em GrupoRepositorio', () => {
    const grupo: Grupo = {
        codigo: 'ABf5aA7',
        nome: 'Restaurante Teste',
        restaurantesEscolhidos: [],
        votacao: []
    }
    const restaurantes: RestauranteBusca[] = [
        { nome: 'Restaurante1', endereco: 'Rua Teste, 422', _id: 'id1' },
        { nome: 'Restaurante2', endereco: 'Av. Ipiranga, 120 - Porto Alegre', _id: 'id2' }
    ];
    const restaurantesVotacao: RestauranteVotacao[] = [
        { data: new Date(), curtidas: 0, restaurante: restaurantes[0] },
        { data: new Date(), curtidas: 0, restaurante: restaurantes[1] }
    ];
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

    // describe('novaVotacaoGrupo -', () => {
    //     it('Recebe como argumento ID de um Grupo e o retorna com uma nova votação', async () => {
    //         //Arrange
    //         let GrupoRepositorioA = GrupoRepositorio;
    //         let Negocio = NegocioModule;
    //         GrupoRepositorioA.buscarGrupoID = jest.fn().mockReturnValue(grupo);
    //         Negocio.novaVotacao = jest.fn().mockReturnValue(restaurantesVotacao);

    //         //Act
    //         const resultado = await GrupoRepositorio.novaVotacaoGrupo('idGrupo');
            
    //         //Assert
    //         expect(resultado).toEqual(grupo);
    //         // expect(grupo.votacao).toEqual(Negocio.novaVotacao);
    //     });
    // });
});
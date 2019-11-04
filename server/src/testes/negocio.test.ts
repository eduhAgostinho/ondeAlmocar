import { criarCodigo, novaVotacao } from "../negocio/negocio";
import { Grupo } from "../entidades/Grupo";
import { RestauranteBusca } from "../entidades/Restaurante";
import * as repositorioRestaurante from "../persistencia/restauranteRepositorio";


describe('Testes em Negocio', () => {

    describe('criarCodigo -', () => {
        it('recebe um número como argumento, e retorna sua quantidade em caracteres', async () => {
            //Act
            const codigo = await criarCodigo(5);
    
            //Assert
            expect(codigo.length).toBe(5);
        });
    });

    describe('novaVotacao -', () => {
        //Arrange
        const restaurantes: RestauranteBusca[] = [
            { nome: 'Restaurante1', endereco: 'Rua Teste, 422', _id: 'id1' },
            { nome: 'Restaurante2', endereco: 'Av. Ipiranga, 120 - Porto Alegre', _id: 'id2' }
        ];
        
        const grupo: Grupo = {
            codigo: 'ABf5aA7',
            nome: 'Restaurante Teste',
            restaurantesEscolhidos: [{ data: new Date(), restaurante: { nome: 'Restaurante1', endereco: 'Rua Teste, 422', _id: 'id1' } }],
            votacao: { status: false, restaurantes: [] }
        }
        let restauranteRepositorio = repositorioRestaurante;
        
        it('recebe um Grupo como argumento com um Restaurante usado na semana, e retorna lista de todos Restaurantes sem ele', async () => {

            //Arrange
            restauranteRepositorio.buscarRestaurantes = jest.fn().mockReturnValue([restaurantes[1]]);
            
            //Act
            const resultado = await novaVotacao(grupo);
    
            //Assert
            expect(resultado).toHaveLength(1);
            expect(resultado[0].restaurante._id).toBe('id2');
            expect(resultado[0].curtidas).toBe(0);
        }, 50000);

        it('recebe um Grupo como argumento com restaurante visitado em outra semana, e retorna lista com todos Restaurantes ', async () => {
            //Arrange
            const restaurantes: RestauranteBusca[] = [
                { nome: 'Restaurante1', endereco: 'Rua Teste, 422', _id: 'id1' },
                { nome: 'Restaurante2', endereco: 'Av. Ipiranga, 120 - Porto Alegre', _id: 'id2' }
            ];
            grupo.restaurantesEscolhidos = [{ data: new Date(2019,9,5), restaurante: { nome: 'Restaurante1', endereco: 'Rua Teste, 422', _id: 'id1' } }];
            restauranteRepositorio.buscarRestaurantes = jest.fn().mockReturnValue([
                restaurantes[0],
                restaurantes[1]
            ]);

            //Act
            const resultado = await novaVotacao(grupo);
    
            //Assert
            expect(grupo.restaurantesEscolhidos).toHaveLength(0);
            expect(resultado).toHaveLength(2);
            expect(resultado[0].restaurante._id).toBe('id1');
            expect(resultado[1].restaurante._id).toBe('id2');
            expect(resultado[0].curtidas).toBe(0);
        }, 50000);
    });
   
});

import { Restaurante } from "../entidades/Restaurante";
import { RestauranteModel } from "../persistencia/restauranteModel";
import * as restauranteRepositorio from '../persistencia/restauranteRepositorio';

let restaurante: Restaurante = {
    nome: 'Restaurante Teste',
    endereco: 'Rua Teste'
}

describe('Testes em restauranteRepositorio', () => {
    describe('novoRestaurante', () => {
        it('Recebe um Restaurante e retorna o objeto cadastrado', async () => {
            //Arrange
            const restauranteDocument = new RestauranteModel(restaurante); 
            RestauranteModel.create = jest.fn().mockReturnValue(restauranteDocument);

            //Act
            const resultado = await restauranteRepositorio.novoRestaurante(restaurante);

            //Assert
            expect(resultado).toBeTruthy();
            expect(RestauranteModel.create).toBeCalledTimes(1);
        });
    });
});
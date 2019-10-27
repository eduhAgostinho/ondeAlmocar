import * as RepositorioUsuario from '../persistencia/usuarioRepositorio';
import * as RepositorioGrupo from '../persistencia/grupoRepositorio';
import { Usuario } from '../entidades/Usuario';
import { UsuarioModel } from '../persistencia/usuarioModel';
import { Grupo, GrupoBusca } from '../entidades/Grupo';
import { GrupoModel } from '../persistencia/grupoModel';

let usuario: Usuario = {
    email: 'usuario@email.com',
    grupo: null,
    nome: 'John Doe',
    senha: 'senha',
    ultimoVoto: new Date(2019,1,15)
}

let grupoTeste: Grupo = {
    codigo: 'ABf5aA7',
    nome: 'Restaurante Teste',
    restaurantesEscolhidos: [],
    votacao: []
}

describe('Testes em usuarioRepositorio', () => {
    describe('atualizarUsuario', () => {
        it('Recebe um email de um Usuario e um Grupo como argumento e retorna o Usuario atualizado', async () => {
            //Arrange
            let usuarioRepositorio = RepositorioUsuario;
            let grupoRepositorio = RepositorioGrupo;
            let user = new UsuarioModel(usuario);
            let group = new GrupoModel(grupoTeste);
            
            usuarioRepositorio.buscarUsuario = jest.fn().mockReturnValue(user);
            grupoRepositorio.buscarGrupoID = jest.fn().mockReturnValue(group);
            user.save = jest.fn().mockReturnValue(user);
            
            //Act
            const resultado = await usuarioRepositorio.atualizarUsuario('usuario@email.com', group);

            //Assert
            expect(resultado).toBeTruthy();
            expect(user.save).toBeCalledTimes(1);
            expect(user.grupo!._id).toEqual(group._id);
        });

        it('Recebe um email de Usuario inexistente e um Grupo e retorna falso', async () => {
            //Arrange
            let usuarioRepositorio = RepositorioUsuario;
            let grupoRepositorio = RepositorioGrupo;
            let group = new GrupoModel(grupoTeste);
            let user = new UsuarioModel(usuario);

            usuarioRepositorio.buscarUsuario = jest.fn().mockReturnValue(false);
            grupoRepositorio.buscarGrupoID = jest.fn().mockReturnValue(group);
            user.save = jest.fn().mockReturnValue(user);

            //Act
            const resultado = await usuarioRepositorio.atualizarUsuario('email@email.com', group);

            //Assert
            expect(resultado).toBeFalsy();
            expect(user.save).toBeCalledTimes(0);
            expect(user.grupo).toBeNull();
        });
    });
});
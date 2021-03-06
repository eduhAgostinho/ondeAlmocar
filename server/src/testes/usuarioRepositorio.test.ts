import * as RepositorioUsuario from '../persistencia/usuarioRepositorio';
import * as RepositorioGrupo from '../persistencia/grupoRepositorio';
import { Usuario } from '../entidades/Usuario';
import { UsuarioModel } from '../persistencia/usuarioModel';
import { Grupo } from '../entidades/Grupo';
import { GrupoModel } from '../persistencia/grupoModel';
import { bcrypt } from '../persistencia/usuarioRepositorio';

let usuario: Usuario = {
    email: 'usuario@email.com',
    grupo: null,
    nome: 'John Doe',
    senha: 'senha',
    ultimoVoto: new Date(2019, 1, 15)
}

let grupoTeste: Grupo = {
    codigo: 'ABf5aA7',
    nome: 'Restaurante Teste',
    restaurantesEscolhidos: [],
    votacao: { status: false, restaurantes: [] }
}

describe('Testes em usuarioRepositorio', () => {
    describe('novoUsuario', () => {
        it('Recebe um Usuario e retorna o objeto cadastrado', async () => {
            //Arrange
            let user = new UsuarioModel(usuario);
            let usuarioRepositorio = RepositorioUsuario;
            UsuarioModel.create = jest.fn().mockReturnValue(user);
            bcrypt.hash = jest.fn().mockReturnValue('novaSenha');
            usuarioRepositorio.buscarUsuario = jest.fn().mockReturnValue(false);

            //Act
            const resultado = await RepositorioUsuario.novoUsuario(usuario);

            //Assert
            expect(resultado).toBeTruthy();
            expect(bcrypt.hash).toBeCalledTimes(1);
            expect(UsuarioModel.create).toBeCalledTimes(1);
        });

        it('Tenta cadastrar Usuario com e-mail já cadastrado e retorna falso', async () => {
            //Arrange
            let user = new UsuarioModel(usuario);
            let usuarioRepositorio = RepositorioUsuario;
            const Bcrypt = bcrypt;
            UsuarioModel.create = jest.fn().mockReturnValue(user);
            Bcrypt.hash = jest.fn().mockReturnValue('novaSenha');
            usuarioRepositorio.buscarUsuario = jest.fn().mockReturnValue(user);

            //Act
            const resultado = await RepositorioUsuario.novoUsuario(usuario);

            //Assert
            expect(resultado).toBeFalsy();
            expect(UsuarioModel.create).toBeCalledTimes(0);
            expect(Bcrypt.hash).toBeCalledTimes(0);
        });
    });

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
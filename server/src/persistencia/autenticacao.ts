import passport from 'passport';
import passportlocal from 'passport-local';
import passportjwt from 'passport-jwt';
import * as usuarioRepositorio from '../persistencia/usuarioRepositorio';
import { compare } from 'bcrypt';


const LocalStrategy = passportlocal.Strategy;

export const pass = passport;

pass.use('login', new LocalStrategy(async (user, passwd, done) => {
    const busca = await usuarioRepositorio.buscarUsuario(user);
    if (busca === null || !await compare(passwd, busca.senha) ) {
        return done(undefined, false, { message: 'Usuário ou senha inválido' });
    }

    return done(undefined, { email: user, nome: busca.nome });
}));

const JwtStrategy = passportjwt.Strategy;

pass.use(new JwtStrategy({
    secretOrKey: '9b7a699568708d417f18d41e4c6c06ba2d802a2f',
    jwtFromRequest: passportjwt.ExtractJwt.fromAuthHeaderAsBearerToken()
}, (token, done) => {
    try {
        return done(undefined, token);
    } catch (error) {
        done(error);
    }
})
);



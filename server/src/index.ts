import app from './app';
import {connect} from 'mongoose';

(async () =>{
     try {
          const servidorMongo = `mongodb+srv://${process.env.MONGO_HOST}:${process.env.MONGO_PASSWORD}@cluster0-wqeu2.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`;
          await connect(servidorMongo, { useNewUrlParser: true });

          app.listen(app.get('port'), () => {
               console.log(`Express executando em http://localhost:${app.get('port')} no modo ${app.get('env')}`);
          });
     } catch (error) {
          console.log('Erro:');
          console.log(error);
     }
})(); 




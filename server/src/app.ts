import express from 'express';
import bodyParser from 'body-parser';
import errorhandler from 'errorhandler';
import cors from 'cors';

const app = express();

app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended: false } ));
app.use(cors());
if (process.env.NODE_ENV !== "production") {
    app.use(errorhandler());
} 
export default app;
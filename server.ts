import * as restify from 'restify';
import ListController from './controllers/ListController';
import * as mongoose from 'mongoose';
import * as q from 'q';

var listeningPort: any = process.env.PORT || 8080;

//-------------------------------------------------------------------------
// set up the db
mongoose.connection.once('open', () => {
  console.log('db connect open')  ;
});
mongoose.connection.on('error', () => {
  console.log('db connect error');
});

(<any>mongoose).Promise = q.Promise;

mongoose.connect('mongodb://localhost/local', { useMongoClient: true });
var db = mongoose.connection;
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// set up the server
var reqHandlers: restify.RequestHandler[] = [
    (req: restify.Request, res: restify.Response, next: restify.Next) => {
        console.log(req.url);
        next();
    }
];

var server: restify.Server = restify.createServer({
    name: "speedywords"
});

server.use(reqHandlers);
server.use(restify.plugins.jsonBodyParser({ mapParams: true }));
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser({ mapParams: true }));

var listController = new ListController(server, db);

server.listen(listeningPort, () => {

    console.log('%s listening on %s', server.name, server.url);
});
//-------------------------------------------------------------------------


import * as restify from 'restify';
import ListController from './controllers/ListController';
import * as mongoose from 'mongoose';
import * as q from 'q';
import * as corsMiddleware from 'restify-cors-middleware';

var listeningPort: any = process.env.PORT || 8080;
var mongoUri: any = process.env.MONGO_URI || 'mongodb://localhost/local';
var corsSite: any = process.env.CORS_SITE || 'http://localhost:4200'

//-------------------------------------------------------------------------
// process clean up
process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('database connection closed');
        process.exit(0);
    })
});


//-------------------------------------------------------------------------
// set up the db
mongoose.connection.once('open', () => {
  console.log('db connect open')  ;
});
mongoose.connection.on('error', () => {
  console.log('db connect error');
});

(<any>mongoose).Promise = q.Promise;

mongoose.connect(mongoUri, { 
    useMongoClient: true,
    db: {
        bufferMaxEntries: 0
    }
});
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

const cors = corsMiddleware({
    origins: [corsSite],
});


// set up a middleware to return 500 if the database is not there
server.pre((req: restify.Request, res: restify.Response, next: restify.Next) => {
    if(mongoose.connection.readyState !== 1) {
        res.send(500);
        next(false);
        return;
    }
    next();
});

server.pre(cors.preflight);
server.use(cors.actual);

server.use(reqHandlers);
server.use(restify.plugins.jsonBodyParser({ mapParams: true }));
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser({ mapParams: true }));


var listController = new ListController(server, db);

server.listen(listeningPort, () => {

    console.log('%s listening on %s', server.name, server.url);
});
//-------------------------------------------------------------------------


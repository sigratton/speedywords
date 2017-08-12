import * as restify from 'restify';
import ListController from './controllers/ListController';
import * as mongoose from 'mongoose';
import * as q from 'q';
import * as corsMiddleware from 'restify-cors-middleware';
import * as passport from 'passport';
//import * as passportAzureAD from 'passport-azure-ad';
import * as passportHttp from 'passport-http';

var listeningPort: any = process.env.PORT || 8080;
var mongoUri: any = process.env.MONGO_URI || 'mongodb://localhost/speedywords';
var corsSite: any = process.env.CORS_SITE || 'http://localhost:4200';
var adminUser: string = process.env.ADMIN_USER || 'admin';
var adminPwd: string = process.env.ADMIN_PWD || 'admin';

//-------------------------------------------------------------------------
// process clean up
process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('database connection closed');
        process.exit(0);
    })
});

//-------------------------------------------------------------------------
// set up the token validation
/*var OIDCOptions: any = {
    identityMetadata: 'https://login.microsoftonline.com/67fcacbd-9f57-4980-a65b-12375b8ce8af/.well-known/openid-configuration',
    issuer: 'https://sts.windows.net/67fcacbd-9f57-4980-a65b-12375b8ce8af/',
    audience: '92b22656-87a6-488e-ad3f-a486dc2eb22c',
    clientID: '92b22656-87a6-488e-ad3f-a486dc2eb22c',
    // no idea why we need these
    //responseType: 'id_token',
    //responseMode: 'query',
    //redirectUrl: 'https://whatever'
};
var OIDCBearerStrategy: any = passportAzureAD.BearerStrategy;

var bearerStrategy = new OIDCBearerStrategy(OIDCOptions, (token, done) => {
    console.log('token in ' + token);
    done(null, token);
});
*/
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
    poolSize: 2,
    keepAlive: 5000,
    bufferMaxEntries: 5
} as any);
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
        console.log('db connection dead sending 500');
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
server.use(restify.plugins.authorizationParser());
server.use(passport.initialize() as any);

// add basic strategy for now because bearerStrategy checks for a subject
// and I was wanting to use client credentials flow which does not have a subject.
//passport.use(bearerStrategy);
var BasicStrategy = passportHttp.BasicStrategy;
passport.use(new BasicStrategy(
  function(userid, password, done) {
    if(userid === adminUser && password === adminPwd) {
        done(null, userid);
        return;
    }
    done(null, false);
  }
));

var listController = new ListController(server, db);

server.listen(listeningPort, () => {
    console.log('%s listening on %s', server.name, server.url);
});
//-------------------------------------------------------------------------


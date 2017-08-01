import restify = require('restify');
import ListController from './controllers/ListController';

var listeningPort: any = process.env.PORT || 8080;


var reqHandlers: restify.RequestHandler[] = [
    (req: restify.Request, res: restify.Response, next: restify.Next) => {
        console.log(req.url);
        next();
    }
];

var server: restify.Server = restify.createServer();

server.use(reqHandlers);

var listController = new ListController(server);
/*server.get('/list/:id', (req: restify.Request, res: restify.Response, next: restify.Next) => {
    res.send('hello ' + req.params.id);
    next();
});*/

server.listen(listeningPort, () => {
    console.log('%s listening on %s', server.name, server.url);
});



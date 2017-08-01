import restify = require('restify');
import listController = require('./controllers/ListController');

var listeningPort: any = process.env.PORT || 8080;


var reqHandlers: restify.RequestHandler[] = [
    (req: restify.Request, res: restify.Response, next: restify.Next) => {
        console.log(req.url);
        next();
    }
];


var server: restify.Server = restify.createServer();

server.use(reqHandlers);


server.get('/list/:id', listController.getList);


server.listen(listeningPort, () => {
    console.log('%s listening on %s', server.name, server.url);
});



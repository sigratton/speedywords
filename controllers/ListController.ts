import restify = require('restify');

class ListController{

    getList(req: restify.Request, res: restify.Response, next: restify.Next) {
        res.send('hello ' + req.params.name);
    }

}

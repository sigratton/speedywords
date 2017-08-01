import { Request, Response, Next, Server } from 'restify';

export default class ListController{
    constructor(server: Server) {
        server.get('/list/:id', this.GetList);
        server.post('/list/:id', this.PostList);
    }

    public GetList(req: Request, res: Response, next: Next) {
        res.send('hello ' + req.params.id);
        next();
    }

    public PostList(req: Request, res: Response, next: Next) {
        res.send(201);
        next();
    }

}


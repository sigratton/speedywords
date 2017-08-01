import { Request, Response, Next, Server } from 'restify';

export default class ListController{
    constructor(server: Server) {
        server.get('/list/:id', this.getList);
    }

    public getList(req: Request, res: Response, next: Next) {
        res.send('hello ' + req.params.id);
    }
}


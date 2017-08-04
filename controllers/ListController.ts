import { Request, Response, Next, Server } from 'restify';
import { Connection } from 'mongoose';
import { WordList, IWordList } from '../models/WordList';

export default class ListController{
    constructor(server: Server, db: Connection) {
        server.get('/list/:id', this.GetList);
        server.get('/list', this.GetList);
        server.post('/list', this.PostList);
    }

    public GetList(req: Request, res: Response, next: Next) {
        if(req.params.id) {
            res.send('hello ' + req.params.id);
            next();
        }
        else {
            WordList.find({}, (err: any, wordlist: IWordList[]) => {
                if(err) {
                    res.send(500, err);
                    next();
                    return;
                }
                
                res.send(wordlist);
                next();
            });
        }
    }

    public PostList(req: Request, res: Response, next: Next) {
        
        let data = req.body || {};
        let wordList = new WordList(data);
        wordList.save()
        .then((savedWordList: IWordList) => {
            res.send(201, savedWordList);
            next();
        })        
        .catch((err) => {
            res.send(500, err);
            next();
        })
        
    }

}


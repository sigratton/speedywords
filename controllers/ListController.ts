import { Request, Response, Next, Server } from 'restify';
import { Connection } from 'mongoose';
import { WordList, IWordList } from '../models/WordList';

export default class ListController{
    constructor(server: Server, db: Connection) {
        server.get('/list/:id', this.GetList);
        server.get('/list', this.GetList);
        server.post('/list', this.PostList);
        server.put('/list', this.PutList);
    }

    private PutList(req: Request, res: Response, next: Next) {
        let data: IWordList = req.body || {};
        //let wordList = new WordList();
        WordList.findOneAndUpdate({ name: data.name }, { $set: data })
        .then((savedWordList: IWordList) => {
            res.send(200, savedWordList);
            next();
        })        
        .catch((err) => {
            res.send(500, err);
            next();
        })
    }

    public GetList(req: Request, res: Response, next: Next) {
        if(req.params.id) {
            res.send('hello ' + req.params.id);
            next();
        }
        else if(req.params.name) {
            WordList.findOne({ name: req.params.name }, (err: any, wordList: IWordList) => {
                if(err) {
                    res.send(500, err);
                    next();
                    return;
                }

                res.send(wordList);
                next();
            });
        }
        else {
            WordList.find({}, (err: any, wordLists: IWordList[]) => {
                if(err) {
                    res.send(500, err);
                    next();
                    return;
                }

                res.send(wordLists);
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
        });
        
    }

}


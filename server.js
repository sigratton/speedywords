"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify = require("restify");
const listController = require("./controllers/ListController");
var listeningPort = process.env.PORT || 8080;
var reqHandlers = [
    (req, res, next) => {
        console.log(req.url);
        next();
    }
];
var server = restify.createServer();
server.use(reqHandlers);
server.get('/list/:id', listController.getList);
server.listen(listeningPort, () => {
    console.log('%s listening on %s', server.name, server.url);
});
//# sourceMappingURL=server.js.map
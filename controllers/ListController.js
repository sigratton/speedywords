"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ListController {
    getList(req, res, next) {
        res.send('hello ' + req.params.name);
    }
}
//# sourceMappingURL=ListController.js.map
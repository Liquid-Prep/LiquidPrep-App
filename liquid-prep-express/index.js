"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Index = exports.$broker = void 0;
const server_1 = require("./server");
const rxjs_1 = require("rxjs");
exports.$broker = new rxjs_1.Subject().asObservable().subscribe((data) => {
    if (data.name == 'score') {
        console.log('subscribe: ', data);
        if (data.assetType === 'Image') {
        }
        else {
        }
    }
});
class Index {
    constructor() {
        this.server = new server_1.Server();
    }
}
exports.Index = Index;
new Index();

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const graphql_1 = __importDefault(require("./graphql"));
const graphql_yoga_1 = require("graphql-yoga");
//const authentication = require('../routes/authentication')
//const secure_session = require('../session/session')
const app = (0, express_1.default)();
const buildPath = path_1.default.normalize(path_1.default.join(__dirname, '../../../../client/build'));
const creatorContestDataPath = path_1.default.normalize(path_1.default.join(__dirname, '../../contest-assets'));
const imgPath = path_1.default.normalize(path_1.default.join(__dirname, '../../img'));
//app.use(secure_session)
app.use(express_1.default.json());
app.use(express_1.default.static(buildPath));
app.use(express_1.default.static(imgPath));
app.use(body_parser_1.default.json({ limit: '50mb' }));
app.use(body_parser_1.default.urlencoded({ limit: '50mb', extended: true }));
//app.use('/authentication', authentication)
//app.use('/hub/graphql', )
const yoga = () => __awaiter(void 0, void 0, void 0, function* () {
    return (0, graphql_yoga_1.createYoga)({
        schema: yield (0, graphql_1.default)(),
        graphqlEndpoint: '/hub/graphql'
    });
});
app.use('/hub/graphql', yoga);
/*
app.get('/img/*', function (req, res, next) {
    res.sendFile(path.join(imgPath, req.url.split('/').slice(2).join('/')))
})
 
app.get('/contest-assets/*', function (req, res, next) {
    res.sendFile(path.join(creatorContestDataPath, req.url.split('/').slice(2).join('/')))
})
 
 
app.get('/*', function (req, res, next) {
    res.sendFile(path.join(buildPath, 'index.html'))
});
*/
exports.default = app;

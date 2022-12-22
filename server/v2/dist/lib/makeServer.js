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
const graphql_yoga_1 = require("graphql-yoga");
const body_parser_1 = __importDefault(require("body-parser"));
const makeServer = (schema, name, port = 4000) => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, express_1.default)();
    const yoga = (0, graphql_yoga_1.createYoga)({
        schema: schema,
        graphqlEndpoint: '/hub/graphql'
    });
    app.use(express_1.default.json());
    app.use(body_parser_1.default.json({ limit: '50mb' }));
    app.use(body_parser_1.default.urlencoded({ limit: '50mb', extended: true }));
    app.use('/hub/graphql', yoga);
    app.listen(port, () => console.log(`${name} running at http://localhost:${port}/hub/graphql`));
});
exports.default = makeServer;

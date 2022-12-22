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
const index_1 = __importDefault(require("./gateway/index"));
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const fs_1 = __importDefault(require("fs"));
const wait_on_1 = __importDefault(require("wait-on"));
const logger = console.log; //require('./logger').child({ service: 'index' })
if (!process.env.NODE_ENV) {
    console.error('Please pass NODE_ENV. Available options are production | development | test');
}
let key = fs_1.default.readFileSync("../localhost.key", "utf-8");
let cert = fs_1.default.readFileSync("../localhost.cert", "utf-8");
var server = http_1.default.createServer(index_1.default);
var secureServer = https_1.default.createServer({ key, cert }, index_1.default);
if (process.env.NODE_ENV === 'development') {
    (0, wait_on_1.default)({ resources: ['tcp:5050', 'tcp:4002', 'tcp:4003'] }, () => __awaiter(void 0, void 0, void 0, function* () {
        secureServer.listen(3001, () => {
            console.log('gateway initialized');
        });
    }));
}

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const makeServer_1 = __importDefault(require("../../lib/makeServer"));
const schema_1 = __importDefault(require("./schema"));
(0, makeServer_1.default)(schema_1.default, 'hub/graphql', 5050);

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("@graphql-tools/schema");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const resolvers_1 = __importDefault(require("./resolvers"));
const schemaFile = path_1.default.join(__dirname, './organizations.schema.graphql');
const typeDefs = fs_1.default.readFileSync(schemaFile, 'utf8');
const organizationsSchema = (0, schema_1.makeExecutableSchema)({
    typeDefs,
    resolvers: resolvers_1.default
});
exports.default = organizationsSchema;

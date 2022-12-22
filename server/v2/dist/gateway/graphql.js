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
const stitch_1 = require("@graphql-tools/stitch");
const wrap_1 = require("@graphql-tools/wrap");
const makeRemoteExecutor_1 = __importDefault(require("../lib/makeRemoteExecutor"));
const makeGatewaySchema = () => __awaiter(void 0, void 0, void 0, function* () {
    const storefrontsExec = (0, makeRemoteExecutor_1.default)('http://localhost:5050/hub/graphql');
    return (0, stitch_1.stitchSchemas)({
        subschemas: [
            {
                schema: yield (0, wrap_1.introspectSchema)(storefrontsExec),
                executor: storefrontsExec,
                batch: true,
                // While the Storefronts service also defines a `Product` type,
                // it contains no unique data. The local `Product` type is really just
                // a foreign key (`Product.upc`) that maps to the Products schema.
                // That means the gateway will never need to perform an inbound request
                // to fetch this version of a `Product`, so no merge query config is needed.
            }
        ]
    });
});
exports.default = makeGatewaySchema;

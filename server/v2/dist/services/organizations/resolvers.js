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
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../../lib/helpers");
const methods_1 = require("./methods");
//import { getDashboardRules, getDashboardWidgets } from "../dashboard/dashboard.methods";
const resolvers = {
    Query: {
        organization: (root, { ens }) => __awaiter(void 0, void 0, void 0, function* () {
            return yield (0, methods_1.fetchOrganization)(ens)
                .then(helpers_1.clean);
        }),
        organizations: () => __awaiter(void 0, void 0, void 0, function* () {
            return yield (0, methods_1.fetchOrganizations)()
                .then(helpers_1.clean);
        })
    },
    /*
    Organization: {
        rules: async (organization: any) => {
            return await getDashboardRules(organization.ens)
        },
        widgets: async (organization: any) => {
            return await getDashboardWidgets(organization.ens)
        },
    }
    */
};
exports.default = resolvers;

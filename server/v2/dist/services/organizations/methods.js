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
exports.removeUserSubscription = exports.addUserSubscription = exports.getUserSubscriptions = exports.doesEnsExist = exports.doesNameExist = exports.fetchOrganization = exports.fetchOrganizations = void 0;
const db = require('../../database/database');
const fetchOrganizations = () => __awaiter(void 0, void 0, void 0, function* () {
    let query = `
        select * from organizations
    `;
    return yield db.query(query);
});
exports.fetchOrganizations = fetchOrganizations;
const fetchOrganization = (ens) => __awaiter(void 0, void 0, void 0, function* () {
    let query = `
        select * from organizations where ens = $1
    `;
    return yield db.query(query, [ens]);
});
exports.fetchOrganization = fetchOrganization;
const doesNameExist = (name, ens) => __awaiter(void 0, void 0, void 0, function* () {
    let query = `
        select exists (select id from organizations where name = $1 and ens != $2)
    `;
    return yield db.query(query, [name, ens]);
});
exports.doesNameExist = doesNameExist;
const doesEnsExist = (ens) => __awaiter(void 0, void 0, void 0, function* () {
    let query = `
        select exists (select id from organizations where ens = $1)
    `;
    return yield db.query(query, [ens]);
});
exports.doesEnsExist = doesEnsExist;
const getUserSubscriptions = (address) => __awaiter(void 0, void 0, void 0, function* () {
    let query = `
        select subscription from subscriptions where address = $1
    `;
    return yield db.query(query, [address]);
});
exports.getUserSubscriptions = getUserSubscriptions;
const addUserSubscription = (ens, address) => __awaiter(void 0, void 0, void 0, function* () {
    let query1 = `
        insert into subscriptions (address, subscription) values ($1, $2)
    `;
    let query2 = `
        update organizations set members = members + 1 where ens = $1
    `;
    return yield Promise.all([
        db.query(query1, [address, ens]),
        db.query(query2, [ens])
    ]);
});
exports.addUserSubscription = addUserSubscription;
const removeUserSubscription = (ens, address) => __awaiter(void 0, void 0, void 0, function* () {
    let query1 = `
        delete from subscriptions where address = $1 AND subscription = $2
    `;
    let query2 = `
        update organizations set members = members - 1 where ens = $1
    `;
    return yield Promise.all([
        db.query(query1, [address, ens]),
        db.query(query2, [ens])
    ]);
});
exports.removeUserSubscription = removeUserSubscription;

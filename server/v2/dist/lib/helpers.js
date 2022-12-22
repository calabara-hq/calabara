"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asArray = exports.clean = void 0;
const clean = (data) => {
    if (data.rows.length == 0)
        return null;
    if (data.rows.length == 1)
        return data.rows[0];
    return data.rows;
};
exports.clean = clean;
const asArray = (data) => {
    if (Array.isArray(data))
        return data;
    if (!data)
        return [];
    return [data];
};
exports.asArray = asArray;

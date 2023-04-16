"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Integer_1 = tslib_1.__importDefault(require("./Integer"));
class ID extends Integer_1.default {
    constructor(attribute, resolveCallback) {
        super(attribute ?? 'id', resolveCallback);
        this.exceptOnForms().orderable().filterable();
    }
}
exports.default = ID;

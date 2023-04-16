"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const NotFoundException_1 = tslib_1.__importDefault(require("./NotFoundException"));
class FieldNotFoundException extends NotFoundException_1.default {
    constructor() {
        super(...arguments);
        this.message = 'Field not found';
    }
}
exports.default = FieldNotFoundException;

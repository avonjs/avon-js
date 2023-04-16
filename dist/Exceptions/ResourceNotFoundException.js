"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const NotFoundException_1 = tslib_1.__importDefault(require("./NotFoundException"));
class ResourceNotFoundException extends NotFoundException_1.default {
    constructor() {
        super(...arguments);
        this.message = 'Resource not found';
    }
}
exports.default = ResourceNotFoundException;

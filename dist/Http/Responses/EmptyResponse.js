"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Response_1 = tslib_1.__importDefault(require("./Response"));
class EmptyResponse extends Response_1.default {
    constructor(meta = {}) {
        super(204, {}, meta);
    }
}
exports.default = EmptyResponse;

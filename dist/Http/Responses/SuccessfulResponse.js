"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Response_1 = tslib_1.__importDefault(require("./Response"));
class SuccessfulResponse extends Response_1.default {
    constructor(message = 'Your action successfully ran.', meta = {}) {
        super(200, { message }, meta);
    }
}
exports.default = SuccessfulResponse;

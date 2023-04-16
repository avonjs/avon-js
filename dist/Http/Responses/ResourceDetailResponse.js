"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Response_1 = tslib_1.__importDefault(require("./Response"));
class ResourceDetailResponse extends Response_1.default {
    constructor(data, meta = {}) {
        super(200, data, meta);
    }
}
exports.default = ResourceDetailResponse;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Response_1 = tslib_1.__importDefault(require("./Response"));
class SchemaResponse extends Response_1.default {
    constructor(data, meta = {}) {
        super(200, data, meta);
    }
    /**
     * Get content for response.
     */
    content() {
        return this.data;
    }
}
exports.default = SchemaResponse;

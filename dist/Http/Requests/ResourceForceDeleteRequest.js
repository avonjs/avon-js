"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
class ResourceDeleteRequest extends _1.AvonRequest {
    /**
     * Indicates type of the request instance.
     */
    type() {
        return _1.RequestTypes.ResourceDeleteRequest;
    }
}
exports.default = ResourceDeleteRequest;

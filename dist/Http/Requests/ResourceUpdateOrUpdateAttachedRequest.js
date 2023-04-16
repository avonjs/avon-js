"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
class ResourceUpdateOrUpdateAttachedRequest extends _1.AvonRequest {
    /**
     * Indicates type of the request instance.
     */
    type() {
        return _1.RequestTypes.ResourceUpdateOrUpdateAttachedRequest;
    }
}
exports.default = ResourceUpdateOrUpdateAttachedRequest;

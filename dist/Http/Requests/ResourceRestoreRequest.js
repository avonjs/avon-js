"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
class ResourceRestoreRequest extends _1.AvonRequest {
    /**
     * Indicates type of the request instance.
     */
    type() {
        return _1.RequestTypes.ResourceRestoreRequest;
    }
}
exports.default = ResourceRestoreRequest;

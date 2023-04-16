"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const _1 = require(".");
const ResourceIndexRequest_1 = tslib_1.__importDefault(require("./ResourceIndexRequest"));
class AssociatableRequest extends ResourceIndexRequest_1.default {
    /**
     * Indicates type of the request instance.
     */
    type() {
        return _1.RequestTypes.AssociatableRequest;
    }
    /**
     * Get the filters for the request.
     */
    filters() {
        return [];
    }
    /**
     * Get the orderings for the request.
     */
    orderings() {
        return [];
    }
}
exports.default = AssociatableRequest;

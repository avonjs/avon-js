"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Filter_1 = tslib_1.__importDefault(require("./Filter"));
class PrimaryKey extends Filter_1.default {
    constructor(...args) {
        super(...args);
        this.nullable();
    }
    /**
     * Apply the filter into the given repository.
     */
    apply(request, repository, value) {
        repository.whereKey(value);
    }
}
exports.default = PrimaryKey;

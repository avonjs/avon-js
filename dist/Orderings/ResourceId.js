"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Repositories_1 = require("../Repositories");
const Ordering_1 = tslib_1.__importDefault(require("./Ordering"));
class PrimaryKey extends Ordering_1.default {
    /**
     * Apply the filter into the given repository.
     */
    apply(request, repository, value) {
        repository.order({
            key: request.model().getKeyName(),
            direction: Repositories_1.Direction.ASC === value ? value : Repositories_1.Direction.DESC,
        });
    }
}
exports.default = PrimaryKey;

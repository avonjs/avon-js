"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Repository_1 = require("../Repositories/Repository");
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
exports.default = (Parent) => {
    class Orderable extends Parent {
        /**
         * Apply the order to the given query.
         */
        applyOrdering(request, repository, value) {
            // eslint-disable-next-line no-useless-call
            this.orderableCallback?.apply(this, [request, repository, value]);
        }
        /**
         * Make the field order.
         */
        resolveOrdering(request) {
            // prevent resolving fields that do not use for ordering
            if (this.orderableCallback != null) {
                return this.makeOrdering(request);
            }
        }
        /**
         * The callback used to determine if the field is orderable.
         */
        orderable(callback) {
            this.orderableCallback = callback ?? this.defaultOrderingCallback();
            return this;
        }
        /**
         * Define the default orderable callback.
         */
        defaultOrderingCallback() {
            return (request, repository, value) => {
                repository.where({
                    key: this.orderableAttribute(request),
                    operator: Repository_1.Operator.eq,
                    value,
                });
            };
        }
    }
    return Orderable;
};

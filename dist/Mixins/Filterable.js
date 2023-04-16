"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Repositories_1 = require("../Repositories");
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
exports.default = (Parent) => {
    class Filterable extends Parent {
        /**
         * Apply the filter to the given query.
         */
        async applyFilter(request, repository, value) {
            // eslint-disable-next-line @typescript-eslint/await-thenable, no-useless-call
            await this.filterableCallback?.apply(this, [request, repository, value]);
        }
        /**
         * Make the field filter.
         */
        resolveFilter(request) {
            // prevent resolving fields that do not use for filtering
            if (this.filterableCallback != null) {
                return this.makeFilter(request);
            }
        }
        /**
         * The callback used to determine if the field is filterable.
         */
        filterable(callback) {
            this.filterableCallback = callback ?? this.defaultFilterableCallback();
            return this;
        }
        /**
         * Define the default filterable callback.
         */
        defaultFilterableCallback() {
            return (request, repository, value) => {
                repository.where({
                    key: this.filterableAttribute(request),
                    operator: Repositories_1.Operator.eq,
                    value,
                });
            };
        }
    }
    return Filterable;
};

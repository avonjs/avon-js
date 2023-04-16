"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Filter_1 = tslib_1.__importDefault(require("../Filters/Filter"));
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
exports.default = (Parent) => {
    return class ResolvesFilters extends Parent {
        /**
         * Get the filters that are available for the given request.
         */
        availableFilters(request) {
            return this.resolveFilters(request)
                .concat(this.resolveFiltersFromFields(request))
                .filter((filter) => filter.authorizedToSee(request));
        }
        /**
         * Get the filters for the given request.
         */
        resolveFilters(request) {
            return this.filters(request);
        }
        /**
         * Get the filters from filterable fields for the given request.
         */
        resolveFiltersFromFields(request) {
            return request
                .resource()
                .filterableFields(request)
                .map((field) => field.resolveFilter(request))
                .filter((filter) => filter instanceof Filter_1.default)
                .unique((filter) => filter.key())
                .all();
        }
        /**
         * Get the filters available on the entity.
         */
        filters(request) {
            return [];
        }
    };
};

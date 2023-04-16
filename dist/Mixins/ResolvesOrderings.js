"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Ordering_1 = tslib_1.__importDefault(require("../Orderings/Ordering"));
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
exports.default = (Parent) => {
    return class ResolvesOrderings extends Parent {
        /**
         * Get the orders that are available for the given request.
         */
        availableOrderings(request) {
            return this.resolveOrderings(request)
                .concat(this.resolveOrderingsFromFields(request))
                .filter((order) => order.authorizedToSee(request));
        }
        /**
         * Get the orders for the given request.
         */
        resolveOrderings(request) {
            return this.orders(request);
        }
        /**
         * Get the orders from orderable fields for the given request.
         */
        resolveOrderingsFromFields(request) {
            return request
                .resource()
                .orderableFields(request)
                .map((field) => field.resolveOrdering(request))
                .filter((order) => order instanceof Ordering_1.default)
                .unique((order) => order.key())
                .all();
        }
        /**
         * Get the orders available on the entity.
         */
        orders(request) {
            return [];
        }
    };
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
exports.default = (Parent) => {
    return class ResolvesFilters extends Parent {
        /**
         * Get the actions that are available for the given request.
         */
        availableActions(request) {
            return this.resolveActions(request).filter((action) => action.authorizedToSee(request));
        }
        /**
         * Get the actions for the given request.
         */
        resolveActions(request) {
            return this.actions(request);
        }
        /**
         * Get the actions available on the entity.
         */
        actions(request) {
            return [
            //
            ];
        }
    };
};

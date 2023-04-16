"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
exports.default = (Parent) => {
    return class AuthorizedToSee extends Parent {
        constructor() {
            super(...arguments);
            /**
             * The callback used to authorize viewing the filter or action.
             */
            this.seeCallback = () => true;
        }
        /**
         * Determine if the filter or action should be available for the given request.
         */
        authorizedToSee(request) {
            return this.seeCallback(request);
        }
        /**
         * Set the callback to be run to authorize viewing the filter or action.
         */
        canSee(callback) {
            this.seeCallback = callback;
            return this;
        }
    };
};

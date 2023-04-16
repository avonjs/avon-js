"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
exports.default = (Parent) => {
    class Prunable extends Parent {
        constructor() {
            super(...arguments);
            /**
             * The callback used to prunable the field.
             */
            this.prunUsingCallback = this.prunCallback;
            /**
             * Indicates if the underlying field is prunable.
             */
            this.prunable = true;
        }
        /**
         * Specify the callback that should be used to prunable the field.
         */
        prunUsing(prunUsingCallback) {
            this.prunUsingCallback = prunUsingCallback;
            return this;
        }
        /**
         * Determine if the underlying file should be pruned when the resource is deleted.
         */
        isPrunable() {
            return this.prunable;
        }
        /**
         * Specify if the underlying field should be pruned when the resource is deleted.
         */
        withPruning(prunable = true) {
            this.prunable = prunable;
            return this;
        }
        /**
         * Handle pruning for the incoming requests.
         */
        async forRequest(request) {
            return this.prunUsingCallback(request, await request.findModelOrFail(), this.attribute);
        }
    }
    return Prunable;
};

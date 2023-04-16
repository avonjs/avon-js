"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
exports.default = (Parent) => {
    return class HasLifecycleMethods extends Parent {
        /**
         * Register a callback to be called before the resource create.
         */
        beforeCreate(request) {
            //
        }
        /**
         * Register a callback to be called after the resource is created.
         */
        afterCreate(request) {
            //
        }
        /**
         * Register a callback to be called before the resource update.
         */
        beforeUpdate(request) {
            //
        }
        /**
         * Register a callback to be called after the resource is updated.
         */
        afterUpdate(request) {
            //
        }
        /**
         * Register a callback to be called before the resource delete.
         */
        beforeDelete(request) {
            //
        }
        /**
         * Register a callback to be called after the resource is destroyed.
         */
        afterDelete(request) {
            //
        }
        /**
         * Register a callback to be called before the resource force-destroyed.
         */
        beforeForceDelete(request) {
            //
        }
        /**
         * Register a callback to be called after the resource is force-destroyed.
         */
        afterForceDelete(request) {
            //
        }
    };
};

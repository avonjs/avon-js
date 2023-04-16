"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
exports.default = (Parent) => {
    return class Presentable extends Parent {
        constructor() {
            super(...arguments);
            /**
             * Callback that indicates if the element should be shown on the index api.
             */
            this.showOnIndexCallback = (request, resource) => true;
            /**
             * Callback that indicates if the element should be shown on the detail api.
             */
            this.showOnDetailCallback = (request, resource) => true;
            /**
             * Callback that indicates if the element should be shown on the creation api.
             */
            this.showOnCreationCallback = (request) => true;
            /**
             * Callback that indicates if the element should be shown on the update api.
             */
            this.showOnUpdateCallback = (request, resource) => true;
        }
        /**
         * Make showing callback for given state.
         */
        showCallback(callback) {
            return typeof callback !== 'function' ? () => callback : callback;
        }
        /**
         * Make hiding callback for given state.
         */
        hideCallback(callback) {
            return (request, resource) => {
                const showCallback = this.showCallback(callback);
                return !showCallback(request, resource);
            };
        }
        /**
         * Specify that the element should be hidden from the index view.
         */
        hideFromIndex(callback = true) {
            this.showOnIndexCallback = this.hideCallback(callback);
            return this;
        }
        /**
         * Specify that the element should be hidden from the detail view.
         */
        hideFromDetail(callback = true) {
            this.showOnDetailCallback = this.hideCallback(callback);
            return this;
        }
        /**
         * Specify that the element should be hidden from the creation view.
         */
        hideWhenCreating(callback = true) {
            this.showOnCreationCallback = this.hideCallback(callback);
            return this;
        }
        /**
         * Specify that the element should be hidden from the update view.
         */
        hideWhenUpdating(callback = true) {
            this.showOnUpdateCallback = this.hideCallback(callback);
            return this;
        }
        /**
         * Specify that the element should be visible on the index view.
         */
        showOnIndex(callback = true) {
            this.showOnIndexCallback = this.showCallback(callback);
            return this;
        }
        /**
         * Specify that the element should be hidden from the detail view.
         */
        showOnDetail(callback = true) {
            this.showOnDetailCallback = this.showCallback(callback);
            return this;
        }
        /**
         * Specify that the element should be hidden from the creation view.
         */
        showOnCreating(callback = true) {
            this.showOnCreationCallback = this.showCallback(callback);
            return this;
        }
        /**
         * Specify that the element should be hidden from the update view.
         */
        showOnUpdating(callback = true) {
            this.showOnUpdateCallback = this.showCallback(callback);
            return this;
        }
        /**
         * Check for showing when updating.
         */
        isShownOnUpdate(request, resource) {
            return this.showOnUpdateCallback(request, resource);
        }
        /**
         * Check showing on index.
         */
        isShownOnIndex(request, resource) {
            return this.showOnIndexCallback(request, resource);
        }
        /**
         * Determine if the field is to be shown on the detail view.
         */
        isShownOnDetail(request, resource) {
            return this.showOnDetailCallback(request, resource);
        }
        /**
         * Check for showing when creating.
         */
        isShownOnCreation(request) {
            return this.showOnCreationCallback(request);
        }
        /**
         * Specify that the element should only be shown on the index view.
         */
        onlyOnIndex() {
            this.showOnIndex(true);
            this.showOnDetail(false);
            this.showOnCreating(false);
            this.showOnUpdating(false);
            return this;
        }
        /**
         * Specify that the element should only be shown on the detail view.
         */
        onlyOnDetail() {
            this.showOnIndex(false);
            this.showOnDetail(true);
            this.showOnCreating(false);
            this.showOnUpdating(false);
            return this;
        }
        /**
         * Specify that the element should only be shown on forms.
         */
        onlyOnForms() {
            this.showOnIndex(false);
            this.showOnDetail(false);
            this.showOnCreating(true);
            this.showOnUpdating(true);
            return this;
        }
        /**
         * Specify that the element should be hidden from forms.
         */
        exceptOnForms() {
            this.showOnIndex(true);
            this.showOnDetail(true);
            this.showOnCreating(false);
            this.showOnUpdating(false);
            return this;
        }
    };
};

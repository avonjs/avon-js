"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrashedStatus = void 0;
const tslib_1 = require("tslib");
const collect_js_1 = tslib_1.__importDefault(require("collect.js"));
const ModelNotFoundException_1 = tslib_1.__importDefault(require("../Exceptions/ModelNotFoundException"));
const Repositories_1 = require("../Repositories");
var TrashedStatus;
(function (TrashedStatus) {
    TrashedStatus["DEFAULT"] = "without";
    TrashedStatus["WITH"] = "with";
    TrashedStatus["ONLY"] = "only";
})(TrashedStatus = exports.TrashedStatus || (exports.TrashedStatus = {}));
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
exports.default = (Parent) => {
    class SoftDeletes extends Parent {
        constructor() {
            super(...arguments);
            /**
             * Indicates that query have to include trashed records.
             */
            this.includeTrashedRecords = false;
            /**
             * Indicates that query have limit to the trashed records.
             */
            this.onlyTrashedRecords = false;
        }
        /**
         * Delete model for the given key.
         */
        async delete(key) {
            const model = await this.find(key);
            if (model === undefined) {
                return;
            }
            model.setAttribute(this.getDeletedAtKey(), this.getDeletedAtValue());
            await this.update(model);
        }
        /**
         * Delete model for the given key.
         */
        async forceDelete(key) {
            // @ts-expect-error ...
            // eslint-disable-next-line @typescript-eslint/await-thenable, @typescript-eslint/no-confusing-void-expression
            await super.delete(key);
        }
        /**
         * Restore the delete model for given key.
         */
        async restore(key) {
            const model = await this.onlyTrashed().find(key);
            ModelNotFoundException_1.default.when(model === undefined);
            model.setAttribute(this.getDeletedAtKey(), null);
            return await this.update(model);
        }
        /**
         * Apply soft-delete constraint.
         */
        applySoftDelete() {
            return this.where(this.scopeSoftDelete());
        }
        /**
         * Ignore soft-delete constraint.
         */
        withTrashed() {
            const constraint = (0, collect_js_1.default)(this.scopeSoftDelete());
            this.wheres = this.wheres.filter((value) => {
                return constraint.diffAssoc((0, collect_js_1.default)(value)).isNotEmpty();
            });
            return this;
        }
        /**
         * Apply only trashed record constraints.
         */
        onlyTrashed() {
            this.where(this.withTrashed().scopeTrashedRecords());
            return this;
        }
        /**
         * Get soft-delete constraint.
         */
        scopeSoftDelete() {
            return {
                key: this.getDeletedAtKey(),
                value: null,
                operator: Repositories_1.Operator.eq,
            };
        }
        /**
         * Get only trashed records constraint.
         */
        scopeTrashedRecords() {
            return {
                key: this.getDeletedAtKey(),
                value: this.getDeletedAtValue(),
                operator: Repositories_1.Operator.in,
            };
        }
        /**
         * Get name of `deleted_at` key.
         */
        getDeletedAtKey() {
            return 'deleted_at';
        }
        /**
         * Get value for `deleted_at` key.
         */
        getDeletedAtValue() {
            return new Date().toDateString();
        }
    }
    return SoftDeletes;
};

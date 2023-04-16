"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const collect_js_1 = require("collect.js");
const Relation_1 = tslib_1.__importDefault(require("../Fields/Relation"));
class FieldCollection extends collect_js_1.Collection {
    /**
     * Find a given field by its attribute.
     */
    findFieldByAttribute(attribute, defaultValue) {
        return this.first((field) => field.attribute === attribute, defaultValue);
    }
    /**
     * Resolve value of fields.
     */
    resolve(resource) {
        return new FieldCollection(this.each((field) => field.resolve(resource)));
    }
    /**
     * Resolve value of fields for display.
     */
    resolveForDisplay(resource) {
        return new FieldCollection(this.each((field) => field.resolveForDisplay(resource)));
    }
    /**
     * Remove non-creation fields from the collection.
     */
    onlyCreateFields(request) {
        return new FieldCollection(this.filter((field) => field.isShownOnCreation(request)));
    }
    /**
     * Remove non-update fields from the collection.
     */
    onlyUpdateFields(request, resource) {
        return new FieldCollection(this.filter((field) => field.isShownOnUpdate(request, resource)));
    }
    /**
     * Filter fields for showing on index.
     */
    filterForIndex(request, resource) {
        return new FieldCollection(this.filter((field) => field.isShownOnIndex(request, resource)).values());
    }
    /**
     * Filter fields for showing on detail.
     */
    filterForDetail(request, resource) {
        return new FieldCollection(this.filter((field) => field.isShownOnDetail(request, resource)).values());
    }
    /**
     * Reject if the field supports Filterable Field.
     */
    withOnlyFilterableFields() {
        return new FieldCollection(this.filter((field) => field.isFilterable()).values());
    }
    /**
     * Reject if the field supports Orderable Field.
     */
    withOnlyOrderableFields() {
        return new FieldCollection(this.filter((field) => field.isOrderable()).values());
    }
    /**
     * Reject if the field supports Relatable Field.
     */
    withOnlyRelatableFields() {
        return new FieldCollection(this.filter((field) => field instanceof Relation_1.default && field.isLoaded()).values());
    }
    /**
     * Reject if the field is rellatable Field.
     */
    withoutRelatableFields() {
        return new FieldCollection(this.reject((field) => field instanceof Relation_1.default).values());
    }
    /**
     * Reject if the field is rellatable Field.
     */
    withoutUnfillableFields() {
        return new FieldCollection(this.filter((field) => field.fillable()).values());
    }
    /**
     * Reject if the field is rellatable Field.
     */
    withoutUnresolvableFields() {
        return new FieldCollection(this.filter((field) => field.resolvable()).values());
    }
    /**
     * Filter elements should be displayed for the given request.
     */
    authorized(request) {
        return new FieldCollection(this.filter((field) => field.authorize(request)).values());
    }
}
exports.default = FieldCollection;

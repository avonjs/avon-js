"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Field_1 = tslib_1.__importDefault(require("./Field"));
const FieldCollection_1 = tslib_1.__importDefault(require("../Collections/FieldCollection"));
const joi_1 = tslib_1.__importDefault(require("joi"));
class Json extends Field_1.default {
    constructor(attribute, fields, resolveCallback) {
        super(attribute, resolveCallback);
        this.fields = new FieldCollection_1.default(fields);
        this.default((request) => {
            return this.fields
                .mapWithKeys((field) => {
                field.resolveDefaultValue(request);
                return [field.attribute, field.getValue(request)];
            })
                .all();
        });
    }
    /**
     * Get the validation rules for this field.
     */
    getRules(request) {
        let rules = {};
        this.fields.each((field) => {
            rules = { ...rules, ...field.getRules(request) };
        });
        return {
            [this.attribute]: joi_1.default.object(rules),
        };
    }
    /**
     * Get the creation rules for this field.
     */
    getCreationRules(request) {
        let rules = {};
        this.fields.each((field) => {
            rules = { ...rules, ...field.getCreationRules(request) };
        });
        return {
            [this.attribute]: joi_1.default.object(rules),
        };
    }
    /**
     * Get the update rules for this field.
     */
    getUpdateRules(request) {
        let rules = {};
        this.fields.each((field) => {
            rules = { ...rules, ...field.getUpdateRules(request) };
        });
        return {
            [this.attribute]: joi_1.default.object(rules),
        };
    }
    /**
     * Hydrate the given attribute on the model based on the incoming request.
     */
    fillAttributeFromRequest(request, requestAttribute, model, attribute) {
        if (!request.exists(requestAttribute)) {
            return;
        }
        const value = request.get(requestAttribute);
        model.setAttribute(attribute, this.isValidNullValue(value) ? this.nullValue() : JSON.stringify(value));
    }
    /**
     * Mutate the field value for response.
     */
    getMutatedValue(request, value) {
        return typeof value === 'string' ? JSON.parse(value) : value;
    }
    /**
     * Determine field is filterable or not.
     */
    isFilterable() {
        return false;
    }
    /**
     * Determine field is orderable or not.
     */
    isOrderable() {
        return false;
    }
    /**
     * Get the swagger-ui schema.
     */
    schema(request) {
        const properties = this.fields.mapWithKeys((field) => [field.attribute, field.schema(request)]);
        return {
            ...super.schema(request),
            type: 'object',
            properties: properties.all(),
        };
    }
}
exports.default = Json;

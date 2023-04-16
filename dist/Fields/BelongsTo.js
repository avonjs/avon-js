"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Repository_1 = require("../Repositories/Repository");
const Relation_1 = tslib_1.__importDefault(require("./Relation"));
const joi_1 = tslib_1.__importDefault(require("joi"));
const FieldCollection_1 = tslib_1.__importDefault(require("../Collections/FieldCollection"));
class BelongsTo extends Relation_1.default {
    /**
     * Mutate the field value for response.
     */
    getMutatedValue(request, value) {
        return this.isLoaded() ? super.getMutatedValue(request, value)[0] : value;
    }
    /**
     * Hydrate the given attribute on the model based on the incoming request.
     */
    fillForAction(request, model) {
        if (request.exists(this.attribute)) {
            model.setAttribute(this.attribute, this.relatedResource.repository().find(request.input(this.attribute)));
        }
    }
    /**
     * Hydrate the given attribute on the model based on the incoming request.
     */
    fillAttributeFromRequest(request, requestAttribute, model, attribute) {
        if (request.exists(requestAttribute)) {
            const value = request.get(requestAttribute);
            model.setAttribute(this.foreignKeyName(request), this.isValidNullValue(value) ? this.nullValue() : value);
        }
    }
    /**
     * Get related models for given resources.
     */
    async SearchRelatables(request, resources) {
        return await this.relatedResource
            .repository()
            .where({
            key: this.ownerKeyName(request),
            value: resources
                .map((resource) => {
                return resource.getAttribute(this.foreignKeyName(request));
            })
                .filter((value) => value),
            operator: Repository_1.Operator.in,
        })
            .all();
    }
    /**
     * Determine field is resolvable or not.
     */
    resolvable() {
        return true;
    }
    /**
     * Determine if the underlying file should be pruned when the resource is deleted.
     */
    isPrunable() {
        return false;
    }
    /**
     * Get the validation rules for this field.
     */
    getRules(request) {
        return {
            [this.attribute]: joi_1.default.any().external(async (value, helpers) => {
                if (this.isValidNullValue(value)) {
                    return;
                }
                const related = await this.relatedResource
                    .repository()
                    .where({
                    key: this.ownerKeyName(request),
                    operator: Repository_1.Operator.eq,
                    value,
                })
                    .first();
                if (related === undefined) {
                    return helpers.error('any.invalid');
                }
            }),
        };
    }
    /**
     * Get the swagger-ui schema.
     */
    schema(request) {
        const schema = super.schema(request);
        if (this.isLoaded()) {
            const fields = new FieldCollection_1.default(this.relatableFields(request));
            schema.type = 'object';
            schema.properties = fields.mapWithKeys((field) => [
                field.attribute,
                field.schema(request),
            ]);
            schema.default = fields.mapWithKeys((field) => [
                field.attribute,
                field.getValue(request),
            ]);
        }
        else {
            schema.type = 'string';
        }
        return schema;
    }
}
exports.default = BelongsTo;

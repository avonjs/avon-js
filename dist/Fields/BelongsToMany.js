"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Repository_1 = require("../Repositories/Repository");
const Avon_1 = tslib_1.__importDefault(require("../Avon"));
const Relation_1 = tslib_1.__importDefault(require("./Relation"));
const ResourceRelationshipGuesser_1 = require("./ResourceRelationshipGuesser");
const helpers_1 = require("../helpers");
const collect_js_1 = tslib_1.__importDefault(require("collect.js"));
const joi_1 = tslib_1.__importDefault(require("joi"));
const Exceptions_1 = require("../Exceptions");
class BelongsToMany extends Relation_1.default {
    constructor(resource, pivot, attribute) {
        super(resource);
        /**
         * Indicates fields uses to update pivot table.
         */
        this.pivotFields = (request) => [];
        const pivotResource = Avon_1.default.resourceForKey(pivot);
        Exceptions_1.RuntimeException.when(pivotResource === undefined, `Invalid pivot:${pivot} preapared for realtion ${resource}`);
        this.pivotResource = pivotResource;
        this.attribute =
            attribute ?? (0, helpers_1.slugify)(this.pivotResource.constructor.name, '_');
        this.nullable(true, (value) => !Array.isArray(value) || value.length === 0);
    }
    /**
     * Determine pivot fields.
     */
    pivots(callback) {
        this.pivotFields = callback;
        return this;
    }
    /**
     * Get the validation rules for this field.
     */
    getRules(request) {
        const rules = super.getRules(request);
        const pivotFields = this.pivotFields(request);
        const pivotRules = this.pivotResource.prepareRuelsForValidator(pivotFields.map((field) => field.getRules(request)));
        return {
            ...rules,
            [this.attribute]: rules[this.attribute].concat(pivotFields.length === 0
                ? joi_1.default.array()
                    .items(joi_1.default.string(), joi_1.default.number())
                    .external(this.existenceRule(request))
                : joi_1.default.array().items(joi_1.default.object(pivotRules).append({
                    key: joi_1.default.alternatives(joi_1.default.string(), joi_1.default.number()).external(this.existenceRule(request)),
                }))),
        };
    }
    /**
     * Get Joi rule to validate resource existance.
     */
    existenceRule(request) {
        return async (value, helpers) => {
            const relateds = await this.relatedResource
                .repository()
                .where({
                key: this.ownerKeyName(request),
                operator: Repository_1.Operator.eq,
                value,
            })
                .first();
            if (relateds === undefined) {
                return helpers.error('any.invalid');
            }
        };
    }
    /**
     * Hydrate the given attribute on the model based on the incoming request.
     */
    fillForAction(request, model) { }
    /**
     * Hydrate the given attribute on the model based on the incoming request.
     */
    fillAttributeFromRequest(request, requestAttribute, model, attribute) {
        if (!request.exists(requestAttribute)) {
            return;
        }
        return async () => {
            // first we clear old attachments
            await this.clearAttachments(request, model);
            // then fill with new attachemnts
            const repository = this.pivotResource.repository();
            await Promise.all(this.prepareRelations(request, requestAttribute).map(async (pivot) => {
                pivot.setAttribute(this.resourceForeignKeyName(request), model.getAttribute(this.resourceOwnerKeyName(request)));
                return await repository.store(pivot);
            }));
        };
    }
    /**
     * Detach all related models.
     */
    async clearAttachments(request, model) {
        const repository = this.pivotResource.repository();
        const attachments = await repository
            .where({
            key: this.foreignKeyName(request),
            value: model.getAttribute(this.ownerKeyName(request)),
            operator: Repository_1.Operator.eq,
        })
            .all();
        await Promise.all(attachments.map(async (attached) => {
            // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
            return await repository.forceDelete(attached.getKey());
        }));
    }
    /**
     * Set related model foreign key.
     */
    setResourceForeignKey(resourceForeignKey) {
        this.resourceForeignKey = resourceForeignKey;
        return this;
    }
    /**
     * Get attribute that holde the related model key.
     */
    resourceForeignKeyName(request) {
        return this.resourceForeignKey ?? (0, ResourceRelationshipGuesser_1.guessForeignKey)(request.resource());
    }
    /**
     * Set the related model owner key.
     */
    setResourceOwnerKey(resourceOwnerKey) {
        this.resourceOwnerKey = resourceOwnerKey;
        return this;
    }
    /**
     * Get attribute that holde the related model key.
     */
    resourceOwnerKeyName(request) {
        return this.resourceOwnerKey ?? request.model().getKeyName();
    }
    /**
     * preappio
     */
    prepareRelations(request, requestAttribute) {
        const pivotFields = this.pivotFields(request);
        const values = (0, collect_js_1.default)(request.array(requestAttribute));
        return values
            .map((related, index) => {
            const model = this.pivotResource.repository().model();
            model.setAttribute(this.foreignKeyName(request), pivotFields.length > 0 ? related.key : related);
            pivotFields.forEach((field) => {
                field.fillInto(request, model, field.attribute, `${requestAttribute}.${index}.${field.attribute}`);
            });
            return model;
        })
            .all();
    }
    /**
     * Resolve related value for given resources.
     */
    async resolveRelatables(request, resources) {
        const relatables = await this.SearchRelatables(request, resources);
        const foreignKeyName = this.resourceForeignKeyName(request);
        const ownerKeyName = this.resourceOwnerKeyName(request);
        resources.forEach((resource) => {
            resource.setAttribute(this.attribute, relatables.filter((relatable) => {
                const pivot = relatable.getAttribute('pivot');
                return (String(pivot[foreignKeyName]) ===
                    String(resource.getAttribute(ownerKeyName)));
            }));
        });
    }
    /**
     * Get related models for given resources.
     */
    async SearchRelatables(request, resources) {
        const foreignKey = this.foreignKeyName(request);
        const ownerKey = this.ownerKeyName(request);
        const pivots = await this.pivotResource
            .repository()
            .where({
            key: this.resourceForeignKeyName(request),
            value: resources
                .map((resource) => {
                return resource.getAttribute(this.resourceOwnerKeyName(request));
            })
                .filter((value) => value),
            operator: Repository_1.Operator.in,
        })
            .all();
        const relateds = await this.relatedResource
            .repository()
            .where({
            key: ownerKey,
            value: pivots.map((pivot) => pivot.getAttribute(foreignKey)),
            operator: Repository_1.Operator.in,
        })
            .all();
        relateds.forEach((related) => {
            related.setAttribute('pivot', pivots.find((pivot) => {
                return (String(pivot.getAttribute(foreignKey)) ===
                    String(related.getAttribute(ownerKey)));
            }));
        });
        return relateds;
    }
    /**
     * Get the value considered as null.
     */
    nullValue() {
        return [];
    }
    /**
     * Determine field is filterable or not.
     */
    isFilterable() {
        return false;
    }
}
exports.default = BelongsToMany;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ResourceRelationshipGuesser_1 = require("./ResourceRelationshipGuesser");
const Avon_1 = tslib_1.__importDefault(require("../Avon"));
const Field_1 = tslib_1.__importDefault(require("./Field"));
const FieldCollection_1 = tslib_1.__importDefault(require("../Collections/FieldCollection"));
const RelatableFilter_1 = tslib_1.__importDefault(require("./Filters/RelatableFilter"));
const collect_js_1 = tslib_1.__importDefault(require("collect.js"));
const SoftDeletes_1 = require("../Mixins/SoftDeletes");
const Exceptions_1 = require("../Exceptions");
class Relation extends Field_1.default {
    constructor(resource, relation) {
        const relatedResource = Avon_1.default.resourceForKey(resource);
        Exceptions_1.RuntimeException.when(relatedResource === undefined, `Resource '${resource}' not found for relationship ${relation ?? resource}`);
        relation = relation ?? (0, ResourceRelationshipGuesser_1.guessRelation)(relatedResource);
        // init parent
        super(relation);
        /**
         * Indicates related resources have to load.
         */
        this.loaded = false;
        /**
         * The callback that should be run to associate relations.
         */
        this.relatableQueryCallback = (request, repository) => request.resource().relatableQuery(request, repository);
        /**
         * Indicates fields uses to display in relation request.
         */
        this.relatableFields = (request) => {
            return this.relatedResource
                .indexFields(request, this.relatedResource.resource)
                .withoutRelatableFields()
                .all();
        };
        this.relation = relation;
        this.relatedResource = relatedResource;
        this.ownerKey = this.relatedResource.repository().model().getKeyName();
        this.foreignKey = `${this.relation}_${this.ownerKey}`;
    }
    /**
     * Mutate the field value for response.
     */
    getMutatedValue(request, value) {
        return (0, collect_js_1.default)(value)
            .map((relatable) => this.formatRelatedResource(request, relatable))
            .values()
            .all();
    }
    /**
     * Format the given related resource.
     */
    formatRelatedResource(request, resource) {
        return new FieldCollection_1.default(this.relatableFields(request))
            .resolve(resource)
            .mapWithKeys((field) => [field.attribute, field.getValue(request)])
            .all();
    }
    /**
     * Set related model foreign key.
     */
    withForeignKey(foreignKey) {
        this.foreignKey = foreignKey;
        return this;
    }
    /**
     * Get attribute that holde the related model key.
     */
    foreignKeyName(request) {
        return this.foreignKey;
    }
    /**
     * Set related model owner key.
     */
    withOwnerKey(ownerKey) {
        this.ownerKey = ownerKey;
        return this;
    }
    /**
     * Get attribute that holde the related model key.
     */
    ownerKeyName(request) {
        return this.ownerKey;
    }
    /**
     * Determine display fields.
     */
    fields(callback) {
        this.relatableFields = callback;
        return this;
    }
    /**
     * Determine field is resolvable or not.
     */
    resolvable() {
        return this.isLoaded();
    }
    /**
     * Specify related resources to load.
     */
    load() {
        this.loaded = true;
        return this;
    }
    /**
     * Determine that related resource loaded.
     */
    isLoaded() {
        return this.loaded;
    }
    /**
     * Resolve related value for given resources.
     */
    async resolveRelatables(request, resources) {
        const relatables = await this.SearchRelatables(request, resources);
        resources.forEach((resource) => {
            resource.setAttribute(this.attribute, relatables.filter((relatable) => {
                return (
                // eslint-disable-next-line eqeqeq
                relatable.getAttribute(this.ownerKeyName(request)) ==
                    resource.getAttribute(this.foreignKeyName(request)));
            }));
        });
    }
    /**
     * Search associatable resources.
     */
    async searchAssociatable(request, withTrashed = false) {
        const repository = await this.relatedResource.search(request, [], [], withTrashed ? SoftDeletes_1.TrashedStatus.WITH : SoftDeletes_1.TrashedStatus.DEFAULT);
        return (
        // eslint-disable-next-line no-useless-call
        this.relatableQueryCallback.apply(this, [request, repository]) ??
            repository);
    }
    /**
     * Determine the associate relations query.
     */
    relatableQueryUsing(relatableQueryCallback) {
        this.relatableQueryCallback = relatableQueryCallback;
        return this;
    }
    /**
     * Define filterable attribute.
     */
    filterableAttribute(request) {
        return this.foreignKeyName(request);
    }
    /**
     * Resolve the field's value.
     */
    resolve(resource, attribute) {
        super.resolve(resource, this.isLoaded() || this.foreignKey === '' ? attribute : this.foreignKey);
    }
    /**
     * Make the field filter.
     */
    makeFilter(request) {
        return new RelatableFilter_1.default(this);
    }
    /**
     * Determine field is filterable or not.
     */
    isFilterable() {
        return true;
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
        const fields = new FieldCollection_1.default(this.relatableFields(request));
        return {
            ...super.schema(request),
            type: 'array',
            default: [
                fields
                    .mapWithKeys((field) => [
                    field.attribute,
                    field.getValue(request),
                ])
                    .all(),
            ],
            items: {
                type: 'object',
                properties: fields.mapWithKeys((field) => [
                    field.attribute,
                    field.schema(request),
                ]),
            },
        };
    }
}
exports.default = Relation;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Repository_1 = require("../Repositories/Repository");
const ResourceRelationshipGuesser_1 = require("./ResourceRelationshipGuesser");
const Relation_1 = tslib_1.__importDefault(require("./Relation"));
class HasManyOrOne extends Relation_1.default {
    constructor(resource, relation) {
        super(resource, relation);
        /**
         * Indicates related resources have to load.
         */
        this.loaded = true;
        this.foreignKey = '';
        this.ownerKey = '';
    }
    /**
     * Get attribute that holde the related model key.
     */
    foreignKeyName(request) {
        return String(this.foreignKey).length > 0
            ? this.foreignKey
            : (0, ResourceRelationshipGuesser_1.guessForeignKey)(request.resource());
    }
    /**
     * Get attribute that holde the related model key.
     */
    ownerKeyName(request) {
        return String(this.ownerKey).length > 0
            ? this.ownerKey
            : request.model().getKeyName();
    }
    /**
     * Define the default filterable callback.
     */
    defaultFilterableCallback() {
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        return async (request, repository, value) => {
            const realteds = await this.relatedResource
                .repository()
                .whereKeys(Array.isArray(value) ? value : [value])
                .all();
            repository.where({
                key: this.ownerKeyName(request),
                value: realteds.map((model) => {
                    return model.getAttribute(this.foreignKeyName(request));
                }),
                operator: Repository_1.Operator.in,
            });
        };
    }
    /**
     * Resolve related value for given resources.
     */
    async resolveRelatables(request, resources) {
        const relatables = await this.SearchRelatables(request, resources);
        resources.forEach((resource) => {
            resource.setAttribute(this.attribute, relatables.filter((relatable) => {
                const relatableKey = String(relatable.getAttribute(this.foreignKeyName(request)));
                const resourceKey = String(resource.getAttribute(this.ownerKeyName(request)));
                return relatableKey === resourceKey;
            }));
        });
    }
    /**
     * Get related models for given resources.
     */
    async SearchRelatables(request, resources) {
        return await this.relatedResource
            .repository()
            .where({
            key: this.foreignKeyName(request),
            value: resources
                .map((resource) => {
                return resource.getAttribute(this.ownerKeyName(request));
            })
                .filter((value) => value),
            operator: Repository_1.Operator.in,
        })
            .all();
    }
    /**
     * Determine field is fillable or not.
     */
    fillable() {
        return false;
    }
}
exports.default = HasManyOrOne;

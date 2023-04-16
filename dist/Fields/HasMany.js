"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Avon_1 = tslib_1.__importDefault(require("../Avon"));
const RuntimeException_1 = tslib_1.__importDefault(require("../Exceptions/RuntimeException"));
const HasManyOrOne_1 = tslib_1.__importDefault(require("./HasManyOrOne"));
const ResourceRelationshipGuesser_1 = require("./ResourceRelationshipGuesser");
class HasMany extends HasManyOrOne_1.default {
    constructor(resource, relation) {
        if (relation === undefined) {
            const relatedResource = Avon_1.default.resourceForKey(resource);
            RuntimeException_1.default.when(relatedResource === undefined, `Resource '${resource}' not found for relationship ${relation ?? resource}`);
            relation = (0, ResourceRelationshipGuesser_1.guessRelation)(relatedResource, true);
        }
        super(resource, relation);
    }
    /**
     * Hydrate the given attribute on the model based on the incoming request.
     */
    fill(request, model) { }
    /**
     * Get the value considered as null.
     */
    nullValue() {
        return [];
    }
}
exports.default = HasMany;

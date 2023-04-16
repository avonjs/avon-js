"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Authorizable_1 = tslib_1.__importStar(require("./Mixins/Authorizable"));
const pluralize_1 = require("pluralize");
const ActionEvent_1 = tslib_1.__importDefault(require("./Repositories/ActionEvent"));
const FillsFields_1 = tslib_1.__importDefault(require("./Mixins/FillsFields"));
const Fluent_1 = tslib_1.__importDefault(require("./Models/Fluent"));
const HasLifecycleMethods_1 = tslib_1.__importDefault(require("./Mixins/HasLifecycleMethods"));
const PerformsQueries_1 = tslib_1.__importDefault(require("./Mixins/PerformsQueries"));
const PerformsValidation_1 = tslib_1.__importDefault(require("./Mixins/PerformsValidation"));
const ResolvesActions_1 = tslib_1.__importDefault(require("./Mixins/ResolvesActions"));
const ResolvesFields_1 = tslib_1.__importDefault(require("./Mixins/ResolvesFields"));
const ResolvesFilters_1 = tslib_1.__importDefault(require("./Mixins/ResolvesFilters"));
const ResolvesOrderings_1 = tslib_1.__importDefault(require("./Mixins/ResolvesOrderings"));
const ResourceSchema_1 = tslib_1.__importDefault(require("./Mixins/ResourceSchema"));
const helpers_1 = require("./helpers");
class Resource extends (0, ResourceSchema_1.default)((0, HasLifecycleMethods_1.default)((0, FillsFields_1.default)((0, ResolvesFields_1.default)((0, Authorizable_1.default)((0, ResolvesActions_1.default)((0, ResolvesOrderings_1.default)((0, ResolvesFilters_1.default)((0, PerformsQueries_1.default)((0, PerformsValidation_1.default)(class {
})))))))))) {
    constructor(resource) {
        super();
        /**
         * Indicates related resource model.
         */
        this.resource = new Fluent_1.default();
        /**
         * The number of results to display when searching relatable resource.
         */
        this.relatableSearchResults = 10;
        this.resource = resource ?? this.repository().model();
    }
    /**
     * Get the uri-key name of the resource
     */
    uriKey() {
        return (0, helpers_1.slugify)((0, pluralize_1.plural)((0, pluralize_1.singular)(this.constructor.name)));
    }
    /**
     * Get the pagination per-page values
     */
    perPageOptions() {
        return [15, 25, 50];
    }
    /**
     * Build an "index" query for the given resource.
     */
    indexQuery(request, repository) {
        return repository;
    }
    /**
     * Build a "detail" query for the given resource.
     */
    detailQuery(request, repository) {
        return repository;
    }
    /**
     * Prepare the resource for JSON serialization.
     */
    async serializeForIndex(request) {
        return {
            athorization: {
                authorizedToView: await this.authorizedTo(request, Authorizable_1.Ability.view),
                authorizedToUpdate: await this.authorizedTo(request, Authorizable_1.Ability.update),
                authorizedToDelete: await this.authorizedTo(request, Authorizable_1.Ability.delete),
                authorizedToForceDelete: this.softDeletes()
                    ? await this.authorizedTo(request, Authorizable_1.Ability.forceDelete)
                    : undefined,
                authorizedToRestore: this.softDeletes()
                    ? await this.authorizedTo(request, Authorizable_1.Ability.restore)
                    : undefined,
            },
            fields: this.indexFields(request, this.resource)
                .withoutUnresolvableFields()
                .mapWithKeys((field) => [
                field.attribute,
                field.getValue(request),
            ])
                .all(),
        };
    }
    /**
     * Prepare the resource for JSON serialization.
     */
    serializeForAssociation(request) {
        return this.associationFields(request)
            .mapWithKeys((field) => [field.attribute, field.getValue(request)])
            .all();
    }
    /**
     * Prepare the resource for JSON serialization.
     */
    async serializeForDetail(request) {
        return {
            athorization: {
                authorizedToUpdate: await this.authorizedTo(request, Authorizable_1.Ability.update),
                authorizedToDelete: await this.authorizedTo(request, Authorizable_1.Ability.delete),
                authorizedToForceDelete: this.softDeletes()
                    ? await this.authorizedTo(request, Authorizable_1.Ability.forceDelete)
                    : undefined,
                authorizedToRestore: this.softDeletes()
                    ? await this.authorizedTo(request, Authorizable_1.Ability.restore)
                    : undefined,
            },
            fields: this.detailFields(request, this.resource)
                .withoutUnresolvableFields()
                .mapWithKeys((field) => [
                field.attribute,
                field.getValue(request),
            ]),
        };
    }
    /**
     * Get the action-event repository.
     */
    actionRepository(request) {
        return new (class extends ActionEvent_1.default {
        })();
    }
    /**
     * Determine if this resource uses soft deletes.
     */
    softDeletes() {
        return (typeof this.repository().withTrashed === 'function' &&
            typeof this.repository().onlyTrashed === 'function' &&
            typeof this.repository().applySoftDelete === 'function');
    }
}
exports.default = Resource;

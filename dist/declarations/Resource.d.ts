import ActionEvent from './Repositories/ActionEvent';
import { type AvonRequest } from './Http/Requests';
import type Field from './Fields/Field';
import { type Model } from './Models';
import type Repository from './Repositories/Repository';
export interface IndexSerilizedResource {
    fields: Record<string, any>;
    athorization: {
        authorizedToView: boolean;
        authorizedToUpdate: boolean;
        authorizedToDelete: boolean;
        authorizedToForceDelete?: boolean;
        authorizedToRestore?: boolean;
    };
}
export interface DetailSerilizedResource {
    fields: Record<string, any>;
    athorization: {
        authorizedToUpdate: boolean;
        authorizedToDelete: boolean;
        authorizedToForceDelete?: boolean;
        authorizedToRestore?: boolean;
    };
}
declare const Resource_base: {
    new (...args: any[]): {
        beforeCreate(request: AvonRequest): void;
        afterCreate(request: AvonRequest): void;
        beforeUpdate(request: AvonRequest): void;
        afterUpdate(request: AvonRequest): void;
        beforeDelete(request: AvonRequest): void;
        afterDelete(request: AvonRequest): void;
        beforeForceDelete(request: AvonRequest): void;
        afterForceDelete(request: AvonRequest): void;
    };
} & {
    new (...args: any[]): {
        fillForCreation<TModel extends Model>(request: AvonRequest, model: TModel): import("./Mixins/FillsFields").Callbacks;
        fillForUpdate<TModel_1 extends Model>(request: AvonRequest, model: TModel_1): import("./Mixins/FillsFields").Callbacks;
        fillFields<TModel_2 extends Model>(request: AvonRequest, model: TModel_2, fields: import("./Collections/FieldCollection").default<Field>): import("./Mixins/FillsFields").Callbacks;
    };
} & {
    new (...args: any[]): {
        [x: string]: any;
        indexFields(request: AvonRequest, resource: Model): import("./Collections/FieldCollection").default<Field>;
        detailFields(request: AvonRequest, resource: Model): import("./Collections/FieldCollection").default<Field>;
        creationFields(request: AvonRequest): import("./Collections/FieldCollection").default<Field>;
        updateFields(request: AvonRequest): import("./Collections/FieldCollection").default<Field>;
        associationFields(request: AvonRequest): import("./Collections/FieldCollection").default<Field>;
        filterableFields(request: AvonRequest): import("./Collections/FieldCollection").default<Field>;
        /**
         * Prepare the resource for JSON serialization.
         */
        orderableFields(request: AvonRequest): import("./Collections/FieldCollection").default<Field>;
        resolveFields(request: AvonRequest): import("./Collections/FieldCollection").default<Field>;
        availableFields(request: AvonRequest): import("./Collections/FieldCollection").default<Field>;
        availableFieldsOnIndexOrDetail(request: AvonRequest): import("./Collections/FieldCollection").default<Field>;
        availableFieldsOnForms(request: AvonRequest): import("./Collections/FieldCollection").default<Field>;
        buildAvailableFields(request: AvonRequest, methods: string[]): import("./Collections/FieldCollection").default<Field>;
        fieldsMethod(request: AvonRequest): string;
        fields(request: AvonRequest): Field[];
        fieldsForCreate(request: AvonRequest): Field[];
        fieldsForUpdate(request: AvonRequest): Field[];
        fieldsForIndex(request: AvonRequest): Field[];
        fieldsForDetail(request: AvonRequest): Field[];
        fieldsForAssociation(request: AvonRequest): Field[];
    };
} & {
    new (...args: any[]): {
        availableActions(request: AvonRequest): import("./Actions").Action[];
        resolveActions(request: AvonRequest): import("./Actions").Action[];
        actions(request: AvonRequest): import("./Actions").Action[];
    };
} & {
    new (...args: any[]): {
        availableOrderings(request: AvonRequest): import("./Orderings").Ordering[];
        resolveOrderings(request: AvonRequest): import("./Orderings").Ordering[];
        resolveOrderingsFromFields(request: AvonRequest): import("./Orderings").Ordering[];
        orders(request: AvonRequest): import("./Orderings").Ordering[];
    };
} & {
    new (...args: any[]): {
        availableFilters(request: AvonRequest): import("./Filters").Filter[];
        resolveFilters(request: AvonRequest): import("./Filters").Filter[];
        resolveFiltersFromFields(request: AvonRequest): import("./Filters").Filter[];
        filters(request: AvonRequest): import("./Filters").Filter[];
    };
} & {
    new (...args: any[]): {
        [x: string]: any;
        search(request: AvonRequest, filters?: import("./Http/Requests").MatchesQueryParameters<import("./Filters").Filter>, orderings?: import("./Http/Requests").MatchesQueryParameters<import("./Orderings").Ordering>, withTrashed?: import("./Mixins/SoftDeletes").TrashedStatus): Promise<Repository<Model>>;
        initializeSearch(request: AvonRequest, filters?: import("./Http/Requests").MatchesQueryParameters<import("./Filters").Filter>, orderings?: import("./Http/Requests").MatchesQueryParameters<import("./Orderings").Ordering>): Promise<Repository<Model>>;
        applySoftDeleteConstraint(repository: Repository<Model>, withTrashed: import("./Mixins/SoftDeletes").TrashedStatus): Repository<Model>;
        applyFilters(request: AvonRequest, repository: Repository<Model>, filters: import("./Http/Requests").MatchesQueryParameters<import("./Filters").Filter>): Promise<Repository<Model>>;
        applyOrderings(request: AvonRequest, repository: Repository<Model>, orderings?: import("./Http/Requests").MatchesQueryParameters<import("./Orderings").Ordering>): Promise<Repository<Model>>;
        relatableQuery(request: AvonRequest, repository: Repository<Model>): Repository<Model>;
    };
} & {
    new (...args: any[]): {
        validateForCreation(request: AvonRequest): Promise<any>;
        validatorForCreation(request: AvonRequest): import("joi").AnySchema<any>;
        rulesForCreation(request: AvonRequest): import("joi").AnySchema<any>[];
        validateForUpdate(request: AvonRequest): Promise<any>;
        validatorForUpdate(request: AvonRequest): import("joi").AnySchema<any>;
        /**
         * Get the pagination per-page values
         */
        rulesForUpdate(request: AvonRequest): import("joi").AnySchema<any>[];
        prepareRuelsForValidator(rules: import("./Mixins/PerformsValidation").Rules[]): import("joi").AnySchema<any>[];
        formatRules(request: AvonRequest, rules: import("joi").AnySchema<any>[]): import("joi").AnySchema<any>[];
        afterValidation(request: AvonRequest, validator: any): any;
        afterCreationValidation(request: AvonRequest, validator: any): any;
        afterUpdateValidation(request: AvonRequest, validator: any): any;
    };
} & {
    new (): {};
};
export default abstract class Resource extends Resource_base {
    /**
     * Indicates related resource model.
     */
    resource: Model;
    /**
     * The number of results to display when searching relatable resource.
     */
    relatableSearchResults: number;
    constructor(resource?: Model);
    /**
     * Get the uri-key name of the resource
     */
    uriKey(): string;
    /**
     * Get the pagination per-page values
     */
    perPageOptions(): number[];
    /**
     * Build an "index" query for the given resource.
     */
    indexQuery(request: AvonRequest, repository: Repository): Repository;
    /**
     * Build a "detail" query for the given resource.
     */
    detailQuery(request: AvonRequest, repository: Repository): Repository;
    /**
     * Prepare the resource for JSON serialization.
     */
    serializeForIndex(request: AvonRequest): Promise<IndexSerilizedResource>;
    /**
     * Prepare the resource for JSON serialization.
     */
    serializeForAssociation(request: AvonRequest): Record<string, any>;
    /**
     * Prepare the resource for JSON serialization.
     */
    serializeForDetail(request: AvonRequest): Promise<DetailSerilizedResource>;
    /**
     * Get the action-event repository.
     */
    actionRepository(request: AvonRequest): ActionEvent;
    /**
     * Determine if this resource uses soft deletes.
     */
    softDeletes(): boolean;
    /**
     * Get the repository.
     */
    abstract repository(): Repository;
}
export {};
//# sourceMappingURL=Resource.d.ts.map
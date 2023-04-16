import { type AvonRequest } from '../Http/Requests';
import Field from './Field';
import type Filter from '../Filters/Filter';
import { type Model } from '../Models';
import { type OpenAPIV3 } from 'openapi-types';
import type AssociatableRequest from '../Http/Requests/AssociatableRequest';
import type Repository from '../Repositories/Repository';
import { type Resource } from '..';
export type DisplayFieldCallback = (request: AvonRequest) => Field[];
export type RelatableQueryCallback = (request: AvonRequest, repository: Repository) => Repository;
export default abstract class Relation extends Field {
    /**
     * Indicates related resources have to load.
     */
    loaded: boolean;
    /**
     * Name of the relationship.
     */
    relation?: string;
    /**
     * The related resource instance
     */
    relatedResource: Resource;
    /**
     * The foreign key of the parent model.
     * The attribute name that holds the parent model key.
     */
    foreignKey: string;
    /**
     * The associated key on the child model.
     * Defaults to primary key of parent model.
     */
    ownerKey: string;
    /**
     * The callback that should be run to associate relations.
     */
    relatableQueryCallback: RelatableQueryCallback;
    constructor(resource: string, relation?: string);
    /**
     * Indicates fields uses to display in relation request.
     */
    protected relatableFields: DisplayFieldCallback;
    /**
     * Mutate the field value for response.
     */
    getMutatedValue(request: AvonRequest, value: any): any;
    /**
     * Format the given related resource.
     */
    formatRelatedResource(request: AvonRequest, resource: Model): Record<string, any>;
    /**
     * Set related model foreign key.
     */
    withForeignKey(foreignKey: string): this;
    /**
     * Get attribute that holde the related model key.
     */
    foreignKeyName(request: AvonRequest): string;
    /**
     * Set related model owner key.
     */
    withOwnerKey(ownerKey: string): this;
    /**
     * Get attribute that holde the related model key.
     */
    ownerKeyName(request: AvonRequest): string;
    /**
     * Determine display fields.
     */
    fields(callback: DisplayFieldCallback): this;
    /**
     * Determine field is resolvable or not.
     */
    resolvable(): boolean;
    /**
     * Specify related resources to load.
     */
    load(): this;
    /**
     * Determine that related resource loaded.
     */
    isLoaded(): boolean;
    /**
     * Resolve related value for given resources.
     */
    resolveRelatables(request: AvonRequest, resources: Model[]): Promise<any>;
    /**
     * Get related models for given resources.
     */
    abstract SearchRelatables(request: AvonRequest, resources: Model[]): Promise<Model[]>;
    /**
     * Search associatable resources.
     */
    searchAssociatable(request: AssociatableRequest, withTrashed?: boolean): Promise<Repository>;
    /**
     * Determine the associate relations query.
     */
    relatableQueryUsing(relatableQueryCallback: RelatableQueryCallback): this;
    /**
     * Define filterable attribute.
     */
    filterableAttribute(request: AvonRequest): string;
    /**
     * Resolve the field's value.
     */
    resolve(resource: Model, attribute?: string): any;
    /**
     * Make the field filter.
     */
    makeFilter(request: AvonRequest): Filter;
    /**
     * Determine field is filterable or not.
     */
    isFilterable(): boolean;
    /**
     * Determine field is orderable or not.
     */
    isOrderable(): boolean;
    /**
     * Get the swagger-ui schema.
     */
    schema(request: AvonRequest): OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject;
}
//# sourceMappingURL=Relation.d.ts.map
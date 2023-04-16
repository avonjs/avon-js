import { type AvonRequest } from '../Http/Requests';
import type Field from './Field';
import { type Model } from '../Models';
import Relation from './Relation';
import Joi from 'joi';
import { type Rules } from '../Mixins/PerformsValidation';
import { type Resource } from '..';
export type PivotFieldCallback = (request: AvonRequest) => Field[];
export default class BelongsToMany extends Relation {
    /**
     * The pivot resource instance
     */
    pivotResource: Resource;
    /**
     * The foreign key of the related model.
     * The attribute name that holds the parent model key.
     */
    protected resourceForeignKey?: string;
    /**
     * The associated key on the related model.
     * Defaults to primary key of related model.
     */
    protected resourceOwnerKey?: string;
    /**
     * Indicates fields uses to update pivot table.
     */
    protected pivotFields: PivotFieldCallback;
    constructor(resource: string, pivot: string, attribute?: string);
    /**
     * Determine pivot fields.
     */
    pivots(callback: PivotFieldCallback): this;
    /**
     * Get the validation rules for this field.
     */
    getRules(request: AvonRequest): Rules;
    /**
     * Get Joi rule to validate resource existance.
     */
    protected existenceRule(request: AvonRequest): Joi.ExternalValidationFunction;
    /**
     * Hydrate the given attribute on the model based on the incoming request.
     */
    fillForAction<TModel extends Model>(request: AvonRequest, model: TModel): any;
    /**
     * Hydrate the given attribute on the model based on the incoming request.
     */
    protected fillAttributeFromRequest<TModel extends Model>(request: AvonRequest, requestAttribute: string, model: TModel, attribute: string): any;
    /**
     * Detach all related models.
     */
    protected clearAttachments(request: AvonRequest, model: Model): Promise<any>;
    /**
     * Set related model foreign key.
     */
    setResourceForeignKey(resourceForeignKey: string): this;
    /**
     * Get attribute that holde the related model key.
     */
    resourceForeignKeyName(request: AvonRequest): string;
    /**
     * Set the related model owner key.
     */
    setResourceOwnerKey(resourceOwnerKey: string): this;
    /**
     * Get attribute that holde the related model key.
     */
    resourceOwnerKeyName(request: AvonRequest): string;
    /**
     * preappio
     */
    prepareRelations(request: AvonRequest, requestAttribute: string): Model[];
    /**
     * Resolve related value for given resources.
     */
    resolveRelatables(request: AvonRequest, resources: Model[]): Promise<any>;
    /**
     * Get related models for given resources.
     */
    SearchRelatables(request: AvonRequest, resources: Model[]): Promise<Model[]>;
    /**
     * Get the value considered as null.
     */
    nullValue(): any;
    /**
     * Determine field is filterable or not.
     */
    isFilterable(): boolean;
}
//# sourceMappingURL=BelongsToMany.d.ts.map
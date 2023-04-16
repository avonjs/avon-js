import Joi from 'joi';
import { type OpenAPIV3 } from 'openapi-types';
import type Filter from '../Filters/Filter';
import { type AvonRequest } from '../Http/Requests';
import Field, { type ResolveCallback } from './Field';
import { type FilterableCallback } from '../Mixins/Filterable';
export default class DateTime extends Field {
    /**
     * The validation rules callback for creation and updates.
     */
    protected rulesSchema: Joi.DateSchema<Date>;
    /**
     * The validation rules callback for creation.
     */
    protected creationRulesSchema: Joi.DateSchema<Date>;
    /**
     * The validation rules callback for updates.
     */
    protected updateRulesSchema: Joi.DateSchema<Date>;
    /**
     * Indicates the date store / retrieve format.
     */
    protected dateFormat: string;
    constructor(attribute: string, resolveCallback?: ResolveCallback);
    /**
     * Mutate the field value for response.
     */
    getMutatedValue(request: AvonRequest, value: any): string;
    /**
     * Determine field is filterable or not.
     */
    isFilterable(): boolean;
    /**
     * Determine field is orderable or not.
     */
    isOrderable(): boolean;
    /**
     * Make the field filter.
     */
    makeFilter(request: AvonRequest): Filter;
    /**
     * Define the default filterable callback.
     */
    defaultFilterableCallback(): FilterableCallback;
    /**
     *
     * Specify store / retrive date format.
     */
    format(dateFormat: string): this;
    /**
     * Get the swagger-ui schema.
     */
    schemas(request: AvonRequest): OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject;
}
//# sourceMappingURL=DateTime.d.ts.map
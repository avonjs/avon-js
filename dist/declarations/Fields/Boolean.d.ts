import Joi from 'joi';
import { type OpenAPIV3 } from 'openapi-types';
import type Filter from '../Filters/Filter';
import { type AvonRequest } from '../Http/Requests';
import Field, { type DefaultCallback } from './Field';
import { type FilterableCallback } from '../Mixins/Filterable';
export default class extends Field {
    /**
     * The callback to be used for the field's default value.
     */
    defaultCallback: DefaultCallback;
    /**
     * The validation rules callback for creation and updates.
     */
    protected rulesSchema: Joi.BooleanSchema<boolean>;
    /**
     * The validation rules callback for creation.
     */
    protected creationRulesSchema: Joi.BooleanSchema<boolean>;
    /**
     * The validation rules callback for updates.
     */
    protected updateRulesSchema: Joi.BooleanSchema<boolean>;
    /**
     * Mutate the field value for response.
     */
    getMutatedValue(request: AvonRequest, value: any): boolean;
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
     * Get the swagger-ui schema.
     */
    schemas(request: AvonRequest): OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject;
}
//# sourceMappingURL=Boolean.d.ts.map
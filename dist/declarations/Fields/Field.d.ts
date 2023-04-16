import Joi, { type AnySchema } from 'joi';
import { type AvonRequest } from '../Http/Requests';
import { type Model } from '../Models';
import { type Validator } from '../Mixins/Nullable';
import { type Rules } from '../Mixins/PerformsValidation';
import { type OrderingCallback } from '../Mixins/Orderable';
import type Filter from '../Filters/Filter';
import type Repository from '../Repositories/Repository';
import Ordering from './Orderings/Ordering';
import { type OpenAPIV3 } from 'openapi-types';
import { type ParameterSerializable } from '../Contracts/ParameterSerializable';
export type ResolveCallback = (value: any, resource: Model, attribute: string) => any;
export type FillCallback = <TModel extends Model>(request: AvonRequest, model: TModel, attribute: string, requestAttribute: string) => any;
export type DefaultCallback = (request: AvonRequest) => any;
declare const Field_base: (abstract new (...args: any[]) => {
    schema(request: AvonRequest): OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject;
}) & (abstract new (...args: any[]) => {
    filterableCallback?: import("../Mixins/Filterable").FilterableCallback | undefined;
    applyFilter(request: AvonRequest, repository: Repository<Model>, value: any): Promise<any>;
    resolveFilter(request: AvonRequest): Filter | undefined;
    filterable(callback?: import("../Mixins/Filterable").FilterableCallback | undefined): any;
    defaultFilterableCallback(): import("../Mixins/Filterable").FilterableCallback;
    makeFilter(request: AvonRequest): Filter;
    filterableAttribute(request: AvonRequest): string;
}) & (abstract new (...args: any[]) => {
    orderableCallback?: OrderingCallback | undefined;
    applyOrdering(request: AvonRequest, repository: Repository<Model>, value: any): any;
    resolveOrdering(request: AvonRequest): import("../Orderings").Ordering | undefined;
    orderable(callback?: OrderingCallback | undefined): any;
    defaultOrderingCallback(): OrderingCallback;
    makeOrdering(request: AvonRequest): import("../Orderings").Ordering;
    orderableAttribute(request: AvonRequest): string;
}) & {
    new (...args: any[]): {
        acceptsNullValues: boolean;
        nullValidator: Validator;
        nullable(nullable?: boolean, validator?: Validator | undefined): any;
        nullValues(nullValidator: Validator): any;
        isNullable(): boolean;
        isValidNullValue(value: any): boolean;
        valueIsConsideredNull(value: any): boolean;
    };
} & {
    new (...args: any[]): {
        showOnIndexCallback: (request: AvonRequest, resource: Model) => boolean;
        showOnDetailCallback: (request: AvonRequest, resource: Model) => boolean;
        showOnCreationCallback: (request: AvonRequest) => boolean;
        showOnUpdateCallback: (request: AvonRequest, resource: Model) => boolean;
        showCallback(callback: import("../Mixins/Presentable").Callback): (request: AvonRequest, resource?: Model | undefined) => boolean;
        hideCallback(callback: import("../Mixins/Presentable").Callback): (request: AvonRequest, resource?: Model | undefined) => boolean;
        hideFromIndex(callback?: import("../Mixins/Presentable").Callback): any;
        hideFromDetail(callback?: import("../Mixins/Presentable").Callback): any;
        hideWhenCreating(callback?: import("../Mixins/Presentable").Callback): any;
        hideWhenUpdating(callback?: import("../Mixins/Presentable").Callback): any;
        showOnIndex(callback?: import("../Mixins/Presentable").Callback): any;
        showOnDetail(callback?: import("../Mixins/Presentable").Callback): any;
        showOnCreating(callback?: import("../Mixins/Presentable").Callback): any;
        showOnUpdating(callback?: import("../Mixins/Presentable").Callback): any;
        isShownOnUpdate(request: AvonRequest, resource: Model): boolean;
        isShownOnIndex(request: AvonRequest, resource: Model): boolean;
        isShownOnDetail(request: AvonRequest, resource: Model): boolean;
        isShownOnCreation(request: AvonRequest): boolean;
        onlyOnIndex(): any;
        onlyOnDetail(): any;
        onlyOnForms(): any;
        exceptOnForms(): any;
    };
} & {
    new (...args: any[]): {
        seeCallback: import("../Mixins/AuthorizedToSee").SeeCallback;
        authorizedToSee(request: AvonRequest): boolean;
        canSee(callback: import("../Mixins/AuthorizedToSee").SeeCallback): any;
    };
} & {
    new (): {};
};
export default abstract class Field extends Field_base implements ParameterSerializable {
    /**
     * The attribute / column name of the field.
     */
    attribute: string;
    /**
     * The validation attribute for the field.
     */
    validationAttribute?: string;
    /**
     * The field's resolved value.
     */
    value?: any;
    /**
     * The callback to be used to hydrate the model attribute.
     */
    fillCallback?: FillCallback;
    /**
     * The callback to be used to resolve the field's display value.
     */
    displayCallback: ResolveCallback;
    /**
     * The callback to be used to resolve the field's value.
     */
    resolveCallback: ResolveCallback;
    /**
     * The callback to be used for the field's default value.
     */
    defaultCallback: DefaultCallback;
    /**
     * The validation rules callback for creation and updates.
     */
    protected rulesSchema: AnySchema;
    /**
     * The validation rules callback for creation.
     */
    protected creationRulesSchema: AnySchema;
    /**
     * The validation rules callback for updates.
     */
    protected updateRulesSchema: AnySchema;
    /**
     * The help text for the field.
     */
    protected helpText?: string;
    /**
     * Custom label for the field.
     */
    protected name?: string;
    /**
     * Define the default orderable callback.
     */
    defaultOrderingCallback(): OrderingCallback;
    constructor(attribute: string, resolveCallback?: ResolveCallback);
    /**
     * Resolve the field's value for display.
     */
    resolveForDisplay(resource: Model, attribute?: string): any;
    /**
     * Resolve the field's value.
     */
    resolve(resource: Model, attribute?: string): any;
    /**
     * Resolve the given attribute from the given resource.
     */
    protected resolveAttribute(resource: Model, attribute: string): any;
    /**
     * Set the callback to be used for determining the field's default value.
     */
    default(callback: DefaultCallback): this;
    /**
     * Resolve the default value for the field.
     */
    resolveDefaultValue(request: AvonRequest): any;
    /**
     * Define the callback that should be used to display the field's value.
     */
    displayUsing(displayCallback: ResolveCallback): this;
    /**
     * Define the callback that should be used to resolve the field's value.
     */
    resolveUsing(resolveCallback: ResolveCallback): this;
    /**
     * Specify a callback that should be used to hydrate the model attribute for the field.
     */
    fillUsing(fillCallback: FillCallback): this;
    /**
     * Hydrate the given attribute on the model based on the incoming request.
     */
    fill<TModel extends Model>(request: AvonRequest, model: TModel): any;
    /**
     * Hydrate the given attribute on the model based on the incoming request.
     */
    fillForAction<TModel extends Model>(request: AvonRequest, model: TModel): any;
    /**
     * Hydrate the given attribute on the model based on the incoming request.
     */
    fillInto<TModel extends Model>(request: AvonRequest, model: TModel, attribute: string, requestAttribute?: string): any;
    /**
     * Hydrate the given attribute on the model based on the incoming request.
     */
    protected fillAttribute<TModel extends Model>(request: AvonRequest, requestAttribute: string, model: TModel, attribute: string): any;
    /**
     * Hydrate the given attribute on the model based on the incoming request.
     */
    protected fillAttributeFromRequest<TModel extends Model>(request: AvonRequest, requestAttribute: string, model: TModel, attribute: string): any;
    /**
     * Get the value considered as null.
     */
    nullValue(): any;
    /**
     * Set the value for the field.
     */
    setValue(value: any): this;
    /**
     * Get the value for the field.
     */
    getValue(request: AvonRequest): any;
    /**
     * Mutate the field value for response.
     */
    abstract getMutatedValue(request: AvonRequest, value: any): any;
    /**
     * Determine if the element should be displayed for the given request.
     */
    authorize(request: AvonRequest): boolean;
    /**
     * Set the validation rules for the field.
     */
    rules(rules: AnySchema): this;
    /**
     * Get the validation rules for this field.
     */
    getRules(request: AvonRequest): Rules;
    /**
     * Get the creation rules for this field.
     */
    getCreationRules(request: AvonRequest): Rules;
    /**
     * Set the creation validation rules for the field.
     */
    creationRules(rules: AnySchema): this;
    /**
     * Get the update rules for this field.
     */
    getUpdateRules(request: AvonRequest): Rules;
    /**
     * Set the creation validation rules for the field.
     */
    updateRules(rules: AnySchema): this;
    /**
     * Get the validation attribute for the field.
     */
    getValidationAttribute(request: AvonRequest): string | undefined;
    /**
     * Get field validator.
     */
    validator(): typeof Joi;
    /**
     * Indicate that the field should be nullable.
     */
    nullable(nullable?: boolean, validator?: Validator): this;
    /**
     * Determine if the field is required.
     */
    isRequired(request: AvonRequest): boolean;
    /**
     * Determine if the field is required for creation.
     */
    isRequiredForCreation(request: AvonRequest): boolean;
    /**
     * Determine if the field is required for update.
     */
    isRequiredForUpdate(request: AvonRequest): boolean;
    /**
     * Define filterable attribute.
     */
    filterableAttribute(request: AvonRequest): string;
    /**
     * Define orderable attribute.
     */
    orderableAttribute(request: AvonRequest): string;
    /**
     * Make the field filter.
     */
    makeFilter(request: AvonRequest): Filter;
    /**
     * Make the field filter.
     */
    makeOrdering(request: AvonRequest): Ordering;
    /**
     * Determine field is fillable or not.
     */
    fillable(): boolean;
    /**
     * Determine field is resolvable or not.
     */
    resolvable(): boolean;
    /**
     * Serialize parameters for schema.
     */
    serializeParameters(request: AvonRequest): OpenAPIV3.ParameterObject[];
    /**
     * Specify the field help text.
     */
    help(helpText: string): this;
    /**
     * Specify the field label.
     */
    withName(name: string): this;
    /**
     * Get the swagger-ui schema.
     */
    schema(request: AvonRequest): OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject;
    /**
     * Determine field is filterable or not.
     */
    abstract isFilterable(): boolean;
    /**
     * Determine field is orderable or not.
     */
    abstract isOrderable(): boolean;
}
export {};
//# sourceMappingURL=Field.d.ts.map
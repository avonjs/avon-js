import Joi, { type AnySchema } from 'joi';
import FieldCollection from '../Collections/FieldCollection';
import { type Model } from '../Models';
import type Field from '../Fields/Field';
import type ActionRequest from '../Http/Requests/ActionRequest';
import { type AvonRequest } from '../Http/Requests';
import Response from '../Http/Responses/Response';
import Fluent from '../Models/Fluent';
import { type OpenAPIV3 } from 'openapi-types';
export interface SerilizedAction {
    uriKey: string;
    isStandalone: boolean;
    fields: object[];
}
export type RunCallback = (request: AvonRequest, resource: Model) => boolean;
declare const Action_base: (abstract new (...args: any[]) => {
    schema(request: AvonRequest): OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject;
}) & {
    new (...args: any[]): {
        seeCallback: import("../Mixins/AuthorizedToSee").SeeCallback;
        authorizedToSee(request: AvonRequest): boolean;
        canSee(callback: import("../Mixins/AuthorizedToSee").SeeCallback): any;
    };
} & {
    new (): {};
};
export default abstract class Action extends Action_base {
    /**
     * The callback used to authorize running the action.
     */
    runCallback?: RunCallback;
    /**
     * Indicates if the action can be run without any models.
     */
    standaloneAction: boolean;
    /**
     * Execute the action for the given request.
     */
    handleRequest(request: ActionRequest): Promise<Response>;
    /**
     * Resolve the creation fields.
     */
    resolveFields(request: AvonRequest): Fluent;
    /**
     * Perform the action on the given models.
     */
    protected abstract handle(fields: Fluent, models: Model[]): Promise<Response | undefined>;
    /**
     * Determine if the action is executable for the given request.
     */
    authorizedToRun(request: AvonRequest, model: Model): boolean;
    /**
     * Validate an action for incoming request.
     *
     * @throws {ValidationException}
     */
    validate(request: AvonRequest): Promise<any>;
    /**
     * Create a validator instance for a resource creation request.
     */
    validator(request: AvonRequest): Joi.AnySchema;
    /**
     * Get the validation rules for a resource creation request.
     */
    rules(request: AvonRequest): AnySchema[];
    /**
     * Perform any final formatting of the given validation rules.
     */
    protected formatRules(request: AvonRequest, rules: AnySchema[]): AnySchema[];
    /**
     * Handle any post-validation processing.
     */
    protected afterValidation(request: AvonRequest, validator: any): any;
    /**
     * Get the fields that are available for the given request.
     */
    availableFields(request: AvonRequest): FieldCollection;
    /**
     * Get the fields available on the action.
     */
    fields(request: AvonRequest): Field[];
    /**
     * Set the callback to be run to authorize running the action.
     */
    canRun(callback?: RunCallback): this;
    /**
     * Get the displayable name of the action.
     */
    name(): string;
    /**
     * Get the URI key for the action.
     */
    uriKey(): string;
    /**
     * Mark the action as a standalone action.
     *
     * @return this
     */
    standalone(): this;
    /**
     * Determine if the action is a standalone action.
     *
     * @return bool
     */
    isStandalone(): boolean;
    /**
     * Prepare the action for JSON serialization.
     */
    serializeForIndex(request: ActionRequest): SerilizedAction;
    /**
     * Get successful response.
     */
    respondSuccess(): Response;
    /**
     * Get the swagger-ui schema.
     */
    schema(request: AvonRequest): OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject;
}
export {};
//# sourceMappingURL=Action.d.ts.map
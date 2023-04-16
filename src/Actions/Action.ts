import Joi, { type AnySchema } from 'joi';
import FieldCollection from '../Collections/FieldCollection';
import { type Model } from '../Models';
import ValidationException from '../Exceptions/ValidationException';
import type Field from '../Fields/Field';
import type ActionRequest from '../Http/Requests/ActionRequest';
import { type AvonRequest } from '../Http/Requests';
import Response from '../Http/Responses/Response';
import AuthorizedToSee from '../Mixins/AuthorizedToSee';
import Fluent from '../Models/Fluent';
import SuccessfulResponse from '../Http/Responses/SuccessfulResponse';
import HasSchema from '../Mixins/HasSchema';
import { type OpenAPIV3 } from 'openapi-types';

export interface SerilizedAction {
  uriKey: string;
  isStandalone: boolean;
  fields: object[];
}

export type RunCallback = (request: AvonRequest, resource: Model) => boolean;

export default abstract class Action extends HasSchema(
  AuthorizedToSee(class {}),
) {
  /**
   * The callback used to authorize running the action.
   */
  public runCallback?: RunCallback;

  /**
   * Indicates if the action can be run without any models.
   */
  public standaloneAction: boolean = false;

  /**
   * Execute the action for the given request.
   */
  public async handleRequest(request: ActionRequest): Promise<Response> {
    const fields = this.resolveFields(request);

    const models = (this.isStandalone() ? [] : await request.models()).filter(
      (model) => this.authorizedToRun(request, model),
    );
    const changes = models.map((original) => {
      return {
        original,
        previous: new Fluent(Object.assign({}, original.all())),
      };
    });

    const results = await this.handle(fields, models);

    const actionReposiory = request.resource().actionRepository(request);
    await actionReposiory.insert(
      changes.map(({ original, previous }) => {
        return actionReposiory.forActionRan(request, this, original, previous);
      }),
    );

    return results instanceof Response ? results : this.respondSuccess();
  }

  /**
   * Resolve the creation fields.
   */
  public resolveFields(request: AvonRequest): Fluent {
    const model = new Fluent();

    this.availableFields(request).authorized(request).resolve(model);

    return model;
  }

  /**
   * Perform the action on the given models.
   */
  protected abstract handle(
    fields: Fluent,
    models: Model[],
  ): Promise<Response | undefined>;

  /**
   * Determine if the action is executable for the given request.
   */
  public authorizedToRun(request: AvonRequest, model: Model): boolean {
    return this.runCallback != null
      ? // eslint-disable-next-line no-useless-call
        this.runCallback.apply(this, [request, model])
      : true;
  }

  /**
   * Validate an action for incoming request.
   *
   * @throws {ValidationException}
   */
  public async validate(request: AvonRequest): Promise<any> {
    await this.validator(request)
      .validateAsync(request.all(), { abortEarly: false, allowUnknown: true })
      .then((value) => {
        this.afterValidation(request, value);
      })
      .catch((error) => {
        ValidationException.throw(error);
      });
  }

  /**
   * Create a validator instance for a resource creation request.
   */
  public validator(request: AvonRequest): Joi.AnySchema {
    return Joi.object(this.rules(request));
  }

  /**
   * Get the validation rules for a resource creation request.
   */
  public rules(request: AvonRequest): AnySchema[] {
    return this.formatRules(
      request,
      this.availableFields(request)
        .mapWithKeys<AnySchema>((field: Field) => {
          return field.getCreationRules(request);
        })
        .all(),
    );
  }

  /**
   * Perform any final formatting of the given validation rules.
   */
  protected formatRules(request: AvonRequest, rules: AnySchema[]): AnySchema[] {
    return rules;
  }

  /**
   * Handle any post-validation processing.
   */
  protected afterValidation(request: AvonRequest, validator: any): any {
    //
  }

  /**
   * Get the fields that are available for the given request.
   */
  public availableFields(request: AvonRequest): FieldCollection {
    return new FieldCollection(this.fields(request));
  }

  /**
   * Get the fields available on the action.
   */
  public fields(request: AvonRequest): Field[] {
    return [];
  }

  /**
   * Set the callback to be run to authorize running the action.
   */
  public canRun(callback?: RunCallback): this {
    this.runCallback = callback;

    return this;
  }

  /**
   * Get the displayable name of the action.
   */
  public name(): string {
    return this.constructor.name;
  }

  /**
   * Get the URI key for the action.
   */
  public uriKey(): string {
    return this.name().replace(
      /[A-Z]/g,
      (matched, offset) => (offset > 0 ? '-' : '') + matched.toLowerCase(),
    );
  }

  /**
   * Mark the action as a standalone action.
   *
   * @return this
   */
  public standalone(): this {
    this.standaloneAction = true;

    return this;
  }

  /**
   * Determine if the action is a standalone action.
   *
   * @return bool
   */
  public isStandalone(): boolean {
    return this.standaloneAction;
  }

  /**
   * Prepare the action for JSON serialization.
   */
  public serializeForIndex(request: ActionRequest): SerilizedAction {
    return {
      uriKey: this.uriKey(),
      isStandalone: this.isStandalone(),
      fields: this.availableFields(request)
        .mapWithKeys((field: Field) => [field.attribute, field])
        .all() as object[],
    };
  }

  /**
   * Get successful response.
   */
  public respondSuccess(): Response {
    return new SuccessfulResponse();
  }

  /**
   * Get the swagger-ui schema.
   */
  public schema(
    request: AvonRequest,
  ): OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject {
    return {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          default: 'Your action ran successfully.',
        },
      },
    };
  }
}

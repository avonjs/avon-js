import Field, { type ResolveCallback } from './Field';
import { type AvonRequest } from '../Http/Requests';
import { type OpenAPIV3 } from 'openapi-types';
import FieldCollection from '../Collections/FieldCollection';
import Joi from 'joi';
import { type Rules } from '../Mixins/PerformsValidation';
import { type Model } from '../Models';

export default class Json extends Field {
  /**
   * The object possible keys.
   */
  protected fields: FieldCollection;

  constructor(
    attribute: string,
    fields: Field[],
    resolveCallback?: ResolveCallback,
  ) {
    super(attribute, resolveCallback);

    this.fields = new FieldCollection(fields);

    this.default((request) => {
      return this.fields
        .mapWithKeys((field: Field) => {
          field.resolveDefaultValue(request);

          return [field.attribute, field.getValue(request)];
        })
        .all() as Record<string, any>;
    });
  }

  /**
   * Get the validation rules for this field.
   */
  public getRules(request: AvonRequest): Rules {
    let rules: Rules = {};

    this.fields.each((field) => {
      rules = { ...rules, ...field.getRules(request) };
    });

    return {
      [this.attribute]: Joi.object(rules),
    };
  }

  /**
   * Get the creation rules for this field.
   */
  public getCreationRules(request: AvonRequest): Rules {
    let rules: Rules = {};

    this.fields.each((field) => {
      rules = { ...rules, ...field.getCreationRules(request) };
    });

    return {
      [this.attribute]: Joi.object(rules),
    };
  }

  /**
   * Get the update rules for this field.
   */
  public getUpdateRules(request: AvonRequest): Rules {
    let rules: Rules = {};

    this.fields.each((field) => {
      rules = { ...rules, ...field.getUpdateRules(request) };
    });

    return {
      [this.attribute]: Joi.object(rules),
    };
  }

  /**
   * Hydrate the given attribute on the model based on the incoming request.
   */
  protected fillAttributeFromRequest<TModel extends Model>(
    request: AvonRequest,
    requestAttribute: string,
    model: TModel,
    attribute: string,
  ): any {
    if (!request.exists(requestAttribute)) {
      return;
    }

    const value = request.get(requestAttribute);

    model.setAttribute(
      attribute,
      this.isValidNullValue(value) ? this.nullValue() : JSON.stringify(value),
    );
  }

  /**
   * Mutate the field value for response.
   */
  public getMutatedValue(request: AvonRequest, value: any): Record<any, any> {
    return typeof value === 'string' ? JSON.parse(value) : value;
  }

  /**
   * Determine field is filterable or not.
   */
  public isFilterable(): boolean {
    return false;
  }

  /**
   * Determine field is orderable or not.
   */
  public isOrderable(): boolean {
    return false;
  }

  /**
   * Get the swagger-ui schema.
   */
  schema(
    request: AvonRequest,
  ): OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject {
    const properties = this.fields.mapWithKeys<
      Record<string, OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject>
    >((field: Field) => [field.attribute, field.schema(request)]);

    return {
      ...super.schema(request),
      type: 'object',
      properties: properties.all() as Record<string, any>,
    };
  }
}

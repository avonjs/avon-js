import { Operator } from '../Repositories/Repository';
import { type AvonRequest } from '../Http/Requests';
import { type Model } from '../Models';
import Relation from './Relation';
import { type OpenAPIV3 } from 'openapi-types';
import { type Rules } from '../Mixins/PerformsValidation';
import Joi from 'joi';
import type Field from './Field';
import FieldCollection from '../Collections/FieldCollection';

export default class BelongsTo extends Relation {
  /**
   * Mutate the field value for response.
   */
  public getMutatedValue(request: AvonRequest, value: any): any {
    return this.isLoaded() ? super.getMutatedValue(request, value)[0] : value;
  }

  /**
   * Hydrate the given attribute on the model based on the incoming request.
   */
  public fillForAction<TModel extends Model>(
    request: AvonRequest,
    model: TModel,
  ): any {
    if (request.exists(this.attribute)) {
      model.setAttribute(
        this.attribute,
        this.relatedResource.repository().find(request.input(this.attribute)),
      );
    }
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
    if (request.exists(requestAttribute)) {
      const value = request.get(requestAttribute);

      model.setAttribute(
        this.foreignKeyName(request),
        this.isValidNullValue(value) ? this.nullValue() : value,
      );
    }
  }

  /**
   * Get related models for given resources.
   */
  public async SearchRelatables(
    request: AvonRequest,
    resources: Model[],
  ): Promise<Model[]> {
    return await this.relatedResource
      .repository()
      .where({
        key: this.ownerKeyName(request),
        value: resources
          .map((resource) => {
            return resource.getAttribute(this.foreignKeyName(request));
          })
          .filter((value) => value),
        operator: Operator.in,
      })
      .all();
  }

  /**
   * Determine field is resolvable or not.
   */
  public resolvable(): boolean {
    return true;
  }

  /**
   * Determine if the underlying file should be pruned when the resource is deleted.
   */
  public isPrunable(): boolean {
    return false;
  }

  /**
   * Get the validation rules for this field.
   */
  public getRules(request: AvonRequest): Rules {
    return {
      [this.attribute]: Joi.any().external(async (value, helpers) => {
        if (this.isValidNullValue(value)) {
          return;
        }

        const related = await this.relatedResource
          .repository()
          .where({
            key: this.ownerKeyName(request),
            operator: Operator.eq,
            value,
          })
          .first();

        if (related === undefined) {
          return helpers.error('any.invalid');
        }
      }),
    };
  }

  /**
   * Get the swagger-ui schema.
   */
  schema(
    request: AvonRequest,
  ): OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject {
    const schema = super.schema(request) as OpenAPIV3.SchemaObject;

    if (this.isLoaded()) {
      const fields = new FieldCollection(this.relatableFields(request));
      schema.type = 'object';
      schema.properties = fields.mapWithKeys((field: Field) => [
        field.attribute,
        field.schema(request),
      ]) as Record<string, OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject>;
      schema.default = fields.mapWithKeys((field: Field) => [
        field.attribute,
        field.getValue(request),
      ]) as Record<string, any>;
    } else {
      schema.type = 'string';
    }

    return schema;
  }
}

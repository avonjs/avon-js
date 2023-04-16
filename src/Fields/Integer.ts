import Joi from 'joi';
import { type OpenAPIV3 } from 'openapi-types';
import { type Model } from '../Models';
import type Filter from '../Filters/Filter';
import { type AvonRequest } from '../Http/Requests';
import { type FilterableCallback } from '../Mixins/Filterable';
import type Repository from '../Repositories/Repository';
import { Operator } from '../Repositories/Repository';
import Field, { type DefaultCallback } from './Field';
import NumberFilter from './Filters/NumberFilter';

export default class Integer extends Field {
  /**
   * The callback to be used for the field's default value.
   */
  public defaultCallback: DefaultCallback = () => {
    return this.isNullable() ? this.nullValue() : 0;
  };

  /**
   * The validation rules callback for creation and updates.
   */
  protected rulesSchema = Joi.number().integer();

  /**
   * The validation rules callback for creation.
   */
  protected creationRulesSchema = Joi.number().integer();

  /**
   * The validation rules callback for updates.
   */
  protected updateRulesSchema = Joi.number().integer();

  /**
   * Mutate the field value for response.
   */
  public getMutatedValue(request: AvonRequest, value: any): number | undefined {
    return parseInt(value);
  }

  /**
   * Determine field is filterable or not.
   */
  public isFilterable(): boolean {
    return true;
  }

  /**
   * Determine field is orderable or not.
   */
  public isOrderable(): boolean {
    return true;
  }

  /**
   * Make the field filter.
   */
  public makeFilter(request: AvonRequest): Filter {
    return new NumberFilter(this);
  }

  /**
   * Define the default filterable callback.
   */
  public defaultFilterableCallback(): FilterableCallback {
    return (
      request: AvonRequest,
      repository: Repository<Model>,
      values: number[],
    ) => {
      if (values[0] !== null) {
        repository.where({
          key: this.filterableAttribute(request),
          operator: Operator.gte,
          value: values[0],
        });
      }

      if (values[1] !== null) {
        repository.where({
          key: this.filterableAttribute(request),
          operator: Operator.lte,
          value: values[1],
        });
      }
    };
  }

  /**
   * Get the swagger-ui schema.
   */
  schema(
    request: AvonRequest,
  ): OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject {
    return {
      ...super.schema(request),
      type: 'integer',
    };
  }
}

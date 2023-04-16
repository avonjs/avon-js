import Joi from 'joi';
import { type OpenAPIV3 } from 'openapi-types';
import type Filter from '../Filters/Filter';
import { type AvonRequest } from '../Http/Requests';
import Field, { type DefaultCallback } from './Field';
import TextFilter from './Filters/TextFilter';
import { Operator } from '../Repositories/Repository';
import type Repository from '../Repositories/Repository';
import { type Model } from '../Models';
import { type FilterableCallback } from '../Mixins/Filterable';

export default class extends Field {
  /**
   * The callback to be used for the field's default value.
   */
  public defaultCallback: DefaultCallback = () => {
    return this.isNullable() ? this.nullValue() : false;
  };

  /**
   * The validation rules callback for creation and updates.
   */
  protected rulesSchema = Joi.boolean();

  /**
   * The validation rules callback for creation.
   */
  protected creationRulesSchema = Joi.boolean();

  /**
   * The validation rules callback for updates.
   */
  protected updateRulesSchema = Joi.boolean();

  /**
   * Mutate the field value for response.
   */
  public getMutatedValue(request: AvonRequest, value: any): boolean {
    return Boolean(value);
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
    return new TextFilter(this);
  }

  /**
   * Define the default filterable callback.
   */
  public defaultFilterableCallback(): FilterableCallback {
    return (
      request: AvonRequest,
      repository: Repository<Model>,
      value: any,
    ) => {
      repository.where({
        key: this.filterableAttribute(request),
        operator: Operator.eq,
        value: Boolean(value),
      });
    };
  }

  /**
   * Get the swagger-ui schema.
   */
  schemas(
    request: AvonRequest,
  ): OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject {
    return {
      ...super.schema(request),
      type: 'boolean',
    };
  }
}

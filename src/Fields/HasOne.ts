import { type OpenAPIV3 } from 'openapi-types';
import { type AvonRequest } from '../Http/Requests';
import HasManyOrOne from './HasManyOrOne';
import collect from 'collect.js';
import type Field from './Field';

export default class HasOne extends HasManyOrOne {
  /**
   * Mutate the field value for response.
   */
  public getMutatedValue(request: AvonRequest, value: any): any {
    return super.getMutatedValue(request, value)[0];
  }

  /**
   * Get the swagger-ui schema.
   */
  schema(
    request: AvonRequest,
  ): OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject {
    return {
      ...super.schema(request),
      type: 'object',
      properties: collect(this.relatableFields(request)).mapWithKeys(
        (field: Field) => [field.attribute, field.schema(request)],
      ) as Record<string, OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject>,
    };
  }
}

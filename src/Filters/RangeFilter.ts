import { type OpenAPIV3 } from 'openapi-types';
import { type AvonRequest } from '../Http/Requests';
import Filter from './Filter';

export default abstract class RangeFilter extends Filter {
  /**
   * Serialize parameters for schema.
   */
  public serializeParameters(
    request: AvonRequest,
  ): OpenAPIV3.ParameterObject[] {
    return [
      {
        name: `filters[${this.key()}][min]`,
        in: 'query',
        explode: true,
        style: 'deepObject',
        schema: this.schema(request),
      },
      {
        name: `filters[${this.key()}][max]`,
        in: 'query',
        explode: true,
        style: 'deepObject',
        schema: this.schema(request),
      },
    ];
  }

  /**
   * Get the swagger-ui schema.
   */
  schema(
    request: AvonRequest,
  ): OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject {
    return {
      type: 'number',
      nullable: this.isNullable(),
    };
  }
}

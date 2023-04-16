import { type OpenAPIV3 } from 'openapi-types';
import { type ParameterSerializable } from '../Contracts/ParameterSerializable';
import QueryParameter from '../Http/Requests/QueryParameter';
import AuthorizedToSee from '../Mixins/AuthorizedToSee';
import { type AvonRequest } from '../Http/Requests';
import { Direction, type Repository } from '../Repositories';

export default abstract class Ordering
  extends AuthorizedToSee(QueryParameter)
  implements ParameterSerializable
{
  /**
   * Get the query parameter key for filter.
   */
  public key(): string {
    return this.constructor.name;
  }

  /**
   * Apply the filter into the given repository.
   */
  public abstract apply(
    request: AvonRequest,
    repository: Repository,
    dirction: any,
  ): any;

  /**
   * Serialize parameters for schema.
   */
  public serializeParameters(
    request: AvonRequest,
  ): OpenAPIV3.ParameterObject[] {
    return [
      {
        name: `orders[${this.key()}]`,
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
      type: 'string',
      nullable: this.isNullable(),
      enum: [Direction.ASC, Direction.DESC],
    };
  }
}

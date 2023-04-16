import { type OpenAPIV3 } from 'openapi-types';
import { type Mixable, type AbstractMixable } from './Mixable';
import { type AvonRequest } from '../Http/Requests';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default <Tbase extends Mixable | AbstractMixable = Mixable>(
  Parent: Tbase,
) => {
  abstract class HasSchema extends Parent {
    /**
     * Get the swagger-ui schema.
     */
    abstract schema(
      request: AvonRequest,
    ): OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject;
  }

  return HasSchema;
};

import Avon from '../Avon';
import { type Model } from '../Models';
import RuntimeException from '../Exceptions/RuntimeException';
import { type AvonRequest } from '../Http/Requests';
import HasManyOrOne from './HasManyOrOne';
import { guessRelation } from './ResourceRelationshipGuesser';
import { type Resource } from '..';

export default class HasMany extends HasManyOrOne {
  constructor(resource: string, relation?: string) {
    if (relation === undefined) {
      const relatedResource = Avon.resourceForKey(resource);

      RuntimeException.when(
        relatedResource === undefined,
        `Resource '${resource}' not found for relationship ${
          relation ?? resource
        }`,
      );

      relation = guessRelation(relatedResource as Resource, true);
    }

    super(resource, relation);
  }

  /**
   * Hydrate the given attribute on the model based on the incoming request.
   */
  public fill<TModel extends Model>(request: AvonRequest, model: TModel): any {}

  /**
   * Get the value considered as null.
   */
  public nullValue(): any {
    return [];
  }
}

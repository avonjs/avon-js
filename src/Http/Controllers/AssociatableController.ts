import Controller from './Controller';
import ResourceAssociationResponse from '../Responses/ResourceAssociationResponse';
import type Response from '../Responses/Response';
import { Ability } from '../../Mixins/Authorizable';
import FieldNotFoundException from '../../Exceptions/FieldNotFoundException';
import type AssociatableRequest from '../Requests/AssociatableRequest';
import { type SearchCollection } from '../../Repositories/Repository';
import type Repository from '../../Repositories/Repository';
import { type Model } from '../../Models';
import type Relation from '../../Fields/Relation';
import { type Resource } from '../..';

export default class AssociatableController extends Controller {
  /**
   * Default route handler
   */
  public async __invoke(request: AssociatableRequest): Promise<Response> {
    const resource = request.resource();
    const field = resource
      .availableFieldsOnForms(request)
      .withOnlyRelatableFields()
      .findFieldByAttribute(request.route('field') as string);

    FieldNotFoundException.when(field === undefined);

    const realtionship = field as Relation;

    const repository: Repository = await realtionship.searchAssociatable(
      request,
      request.query('withTrashed') === 'true',
    );

    const { items, count }: SearchCollection<Model> = await repository.search(
      request.string('search', ''),
      request.currentPage(),
      realtionship.relatedResource.relatableSearchResults,
    );

    const relatedResource = (resource: Model): Resource => {
      return new realtionship.relatedResource.constructor.prototype.constructor(
        resource,
      );
    };
    const resources = await Promise.all(
      items
        .map((item: Model) => relatedResource(item))
        .filter((associatable: Resource) => {
          return resource.authorizedTo(request, Ability.add, [associatable]);
        }),
    );

    return new ResourceAssociationResponse(
      resources.map((resource: Resource) => {
        return resource.serializeForAssociation(request);
      }),
      {
        count,
        currentPage: request.currentPage(),
        perPage: realtionship.relatedResource.relatableSearchResults,
        perPageOptions: [realtionship.relatedResource.relatableSearchResults],
      },
    );
  }
}

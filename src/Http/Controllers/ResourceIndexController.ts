import Controller from './Controller';
import type ResourceIndexRequest from '../Requests/ResourceIndexRequest';
import ResourceIndexResponse from '../Responses/ResourceIndexResponse';
import type Response from '../Responses/Response';
import { Ability } from '../../Mixins/Authorizable';

export default class ResourceIndexController extends Controller {
  /**
   * Default route handler
   */
  public async __invoke(request: ResourceIndexRequest): Promise<Response> {
    const resource = request.resource();

    await resource.authorizeTo(request, Ability.viewAny);

    const { resources, count } = await request.searchIndex();

    return new ResourceIndexResponse(resources, {
      count,
      currentPage: request.currentPage(),
      perPage: request.perPage(),
      perPageOptions: resource.perPageOptions(),
    });
  }
}

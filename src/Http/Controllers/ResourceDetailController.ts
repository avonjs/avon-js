import { Ability } from '../../Mixins/Authorizable';
import Controller from './Controller';
import type Response from '../Responses/Response';
import ResourceDetailResponse from '../Responses/ResourceDetailResponse';
import type ResourceDetailRequest from '../Requests/ResourceDetailRequest';
import ModelNotFoundException from '../../Exceptions/ModelNotFoundException';

export default class ResourceDetailController extends Controller {
  /**
   * Default route handler
   */
  public async __invoke(request: ResourceDetailRequest): Promise<Response> {
    const model = await request
      .resource()
      .detailQuery(request, request.findModelQuery())
      .first();

    ModelNotFoundException.when(model === undefined);

    const resource = request.newResource(model);

    await resource.authorizeTo(request, Ability.view);

    await Promise.all(
      resource
        .detailFields(request, model!)
        .withOnlyRelatableFields()
        .map(async (field) => await field.resolveRelatables(request, [model!])),
    );

    return new ResourceDetailResponse(
      await resource.serializeForDetail(request),
    );
  }
}

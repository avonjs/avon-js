import { Ability } from '../../Mixins/Authorizable';
import Controller from './Controller';
import type Response from '../Responses/Response';
import type ResourceRestoreRequest from '../Requests/ResourceRestoreRequest';
import { EmptyResponse } from '../Responses';

export default class ResourceRestoreController extends Controller {
  /**
   * Default route handler
   */
  public async __invoke(request: ResourceRestoreRequest): Promise<Response> {
    const repository = request.repository();
    const resource = request.newResource(
      await request
        .resource()
        .detailQuery(request, request.findModelQuery())
        .first(),
    );

    await resource.authorizeTo(request, Ability.restore);

    await repository.transaction<any>(async () => {
      const model = await repository.restore(request.route('resourceId'));

      const actionReposiory = resource.actionRepository(request);
      await actionReposiory.store(
        actionReposiory.forResourceRestore(request, model),
      );
    });

    return new EmptyResponse();
  }
}

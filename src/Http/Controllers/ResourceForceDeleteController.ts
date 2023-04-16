import { Ability } from '../../Mixins/Authorizable';
import Controller from './Controller';
import type Response from '../Responses/Response';
import { EmptyResponse } from '../Responses';
import type ResourceDeleteRequest from '../Requests/ResourceForceDeleteRequest';

export default class ResourceForceDeleteController extends Controller {
  /**
   * Default route handler
   */
  public async __invoke(request: ResourceDeleteRequest): Promise<Response> {
    const resource = await request.findResourceOrFail();
    const repository = request.repository();
    const model = await request.findModelOrFail();

    await resource.authorizeTo(request, Ability.delete);

    await repository.transaction<void>(async () => {
      // handle prunable fields
      // await Promise.all(
      //   resource
      //     .prunableFields(request, false)
      //     .map((field) => field.forRequest(request)),
      // );

      // eslint-disable-next-line @typescript-eslint/await-thenable, @typescript-eslint/no-confusing-void-expression
      await resource.beforeForceDelete(request);

      await repository.forceDelete(model.getKey());

      // eslint-disable-next-line @typescript-eslint/await-thenable, @typescript-eslint/no-confusing-void-expression
      await resource.afterForceDelete(request);

      const actionReposiory = resource.actionRepository(request);
      await actionReposiory.store(
        actionReposiory.forResourceDelete(request, model),
      );
    });

    return new EmptyResponse();
  }
}

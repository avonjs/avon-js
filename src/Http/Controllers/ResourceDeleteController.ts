import { Ability } from '../../Mixins/Authorizable';
import Controller from './Controller';
import type Response from '../Responses/Response';
import type ResourceDeleteRequest from '../Requests/ResourceDeleteRequest';
import { EmptyResponse } from '../Responses';

export default class ResourceDeleteController extends Controller {
  /**
   * Default route handler
   */
  public async __invoke(request: ResourceDeleteRequest): Promise<Response> {
    const resource = await request.findResourceOrFail();
    const repository = request.repository();
    const model = await request.findModelOrFail();

    await resource.authorizeTo(request, Ability.delete);

    await repository.transaction<any>(async () => {
      // handle prunable fields
      // await Promise.all(
      //   resource
      //     .prunableFields(request, false)
      //     .map((field) => field.forRequest(request)),
      // );

      // eslint-disable-next-line @typescript-eslint/await-thenable, @typescript-eslint/no-confusing-void-expression
      await resource.beforeDelete(request);

      await request.repository().delete(model.getKey());

      // eslint-disable-next-line @typescript-eslint/await-thenable, @typescript-eslint/no-confusing-void-expression
      await resource.afterDelete(request);

      const actionReposiory = resource.actionRepository(request);
      await actionReposiory.store(
        actionReposiory.forResourceDelete(request, model),
      );
    });

    return new EmptyResponse();
  }
}

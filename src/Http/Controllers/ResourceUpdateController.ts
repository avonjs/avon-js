import { Ability } from '../../Mixins/Authorizable';
import Controller from './Controller';
import type ResourceUpdateOrUpdateAttachedRequest from '../Requests/ResourceUpdateOrUpdateAttachedRequest';
import type Response from '../Responses/Response';
import ResourceUpdateResponse from '../Responses/ResourceUpdateResponse';

export default class ResourceUpdateController extends Controller {
  /**
   * Default route handler
   */
  public async __invoke(
    request: ResourceUpdateOrUpdateAttachedRequest,
  ): Promise<Response> {
    const resourceClass = await request.findResourceOrFail();
    const repository = request.repository();
    const resourceModel = await request.findModelOrFail();

    await resourceClass.authorizeTo(request, Ability.update);
    await resourceClass.validateForUpdate(request);

    const resource = await repository.transaction<typeof resourceClass>(
      async () => {
        const [model, callbacks] = request
          .resource()
          .fillForUpdate<typeof resourceModel>(request, resourceClass.resource);

        const resource = request.newResource(model);

        // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression, @typescript-eslint/await-thenable
        await resource.beforeUpdate(request);

        await request.repository().update(model);

        // Attenction:
        // Here we have to run the "callbacks" in order
        // To avoid update/insert at the same time
        // Using "Promise.all" here will give the wrong result in some scenarios
        for (const callback of callbacks) await callback();

        // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression, @typescript-eslint/await-thenable
        await resource.afterUpdate(request);

        const actionReposiory = resourceClass.actionRepository(request);
        await actionReposiory.store(
          actionReposiory.forResourceUpdate(request, model, resourceModel),
        );

        return resource;
      },
    );

    return new ResourceUpdateResponse(
      await resource.serializeForDetail(request),
    );
  }
}

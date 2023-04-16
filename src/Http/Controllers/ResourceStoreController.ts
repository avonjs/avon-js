import { Ability } from '../../Mixins/Authorizable';
import Controller from './Controller';
import type ResourceCreateOrAttachRequest from '../Requests/ResourceCreateOrAttachRequest';
import ResourceStoreResponse from '../Responses/ResourceStoreResponse';
import type Response from '../Responses/Response';

export default class ResourceStoreController extends Controller {
  /**
   * Default route handler
   */
  public async __invoke(
    request: ResourceCreateOrAttachRequest,
  ): Promise<Response> {
    const resourceClass = request.resource();
    const repository = request.repository();
    const resourceModel = request.model();

    await resourceClass.authorizeTo(request, Ability.create);
    await resourceClass.validateForCreation(request);

    const resource = await repository.transaction<typeof resourceClass>(
      async () => {
        const [model, callbacks] = request
          .resource()
          .fillForCreation<typeof resourceModel>(request, resourceModel);

        const resource = request.newResource(model);

        // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression, @typescript-eslint/await-thenable
        await resource.beforeCreate(request);

        await request.repository().store(model);

        // Attenction:
        // Here we have to run the "callbacks" in order
        // To avoid update/insert at the same time
        // Using "Promise.all" here will give the wrong result in some scenarios
        for (const callback of callbacks) await callback();

        // eslint-disable-next-line @typescript-eslint/await-thenable, @typescript-eslint/no-confusing-void-expression
        await resource.afterCreate(request);

        const actionReposiory = resource.actionRepository(request);
        await actionReposiory.store(
          actionReposiory.forResourceStore(request, model),
        );

        return resource;
      },
    );

    return new ResourceStoreResponse(
      await resource.serializeForDetail(request),
    );
  }
}

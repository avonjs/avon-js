"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Authorizable_1 = require("../../Mixins/Authorizable");
const Controller_1 = tslib_1.__importDefault(require("./Controller"));
const ResourceUpdateResponse_1 = tslib_1.__importDefault(require("../Responses/ResourceUpdateResponse"));
class ResourceUpdateController extends Controller_1.default {
    /**
     * Default route handler
     */
    async __invoke(request) {
        const resourceClass = await request.findResourceOrFail();
        const repository = request.repository();
        const resourceModel = await request.findModelOrFail();
        await resourceClass.authorizeTo(request, Authorizable_1.Ability.update);
        await resourceClass.validateForUpdate(request);
        const resource = await repository.transaction(async () => {
            const [model, callbacks] = request
                .resource()
                .fillForUpdate(request, resourceClass.resource);
            const resource = request.newResource(model);
            // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression, @typescript-eslint/await-thenable
            await resource.beforeUpdate(request);
            await request.repository().update(model);
            // Attenction:
            // Here we have to run the "callbacks" in order
            // To avoid update/insert at the same time
            // Using "Promise.all" here will give the wrong result in some scenarios
            for (const callback of callbacks)
                await callback();
            // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression, @typescript-eslint/await-thenable
            await resource.afterUpdate(request);
            const actionReposiory = resourceClass.actionRepository(request);
            await actionReposiory.store(actionReposiory.forResourceUpdate(request, model, resourceModel));
            return resource;
        });
        return new ResourceUpdateResponse_1.default(await resource.serializeForDetail(request));
    }
}
exports.default = ResourceUpdateController;

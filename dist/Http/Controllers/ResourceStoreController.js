"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Authorizable_1 = require("../../Mixins/Authorizable");
const Controller_1 = tslib_1.__importDefault(require("./Controller"));
const ResourceStoreResponse_1 = tslib_1.__importDefault(require("../Responses/ResourceStoreResponse"));
class ResourceStoreController extends Controller_1.default {
    /**
     * Default route handler
     */
    async __invoke(request) {
        const resourceClass = request.resource();
        const repository = request.repository();
        const resourceModel = request.model();
        await resourceClass.authorizeTo(request, Authorizable_1.Ability.create);
        await resourceClass.validateForCreation(request);
        const resource = await repository.transaction(async () => {
            const [model, callbacks] = request
                .resource()
                .fillForCreation(request, resourceModel);
            const resource = request.newResource(model);
            // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression, @typescript-eslint/await-thenable
            await resource.beforeCreate(request);
            await request.repository().store(model);
            // Attenction:
            // Here we have to run the "callbacks" in order
            // To avoid update/insert at the same time
            // Using "Promise.all" here will give the wrong result in some scenarios
            for (const callback of callbacks)
                await callback();
            // eslint-disable-next-line @typescript-eslint/await-thenable, @typescript-eslint/no-confusing-void-expression
            await resource.afterCreate(request);
            const actionReposiory = resource.actionRepository(request);
            await actionReposiory.store(actionReposiory.forResourceStore(request, model));
            return resource;
        });
        return new ResourceStoreResponse_1.default(await resource.serializeForDetail(request));
    }
}
exports.default = ResourceStoreController;

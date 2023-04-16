"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Authorizable_1 = require("../../Mixins/Authorizable");
const Controller_1 = tslib_1.__importDefault(require("./Controller"));
const Responses_1 = require("../Responses");
class ResourceForceDeleteController extends Controller_1.default {
    /**
     * Default route handler
     */
    async __invoke(request) {
        const resource = await request.findResourceOrFail();
        const repository = request.repository();
        const model = await request.findModelOrFail();
        await resource.authorizeTo(request, Authorizable_1.Ability.delete);
        await repository.transaction(async () => {
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
            await actionReposiory.store(actionReposiory.forResourceDelete(request, model));
        });
        return new Responses_1.EmptyResponse();
    }
}
exports.default = ResourceForceDeleteController;

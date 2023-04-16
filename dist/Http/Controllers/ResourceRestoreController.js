"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Authorizable_1 = require("../../Mixins/Authorizable");
const Controller_1 = tslib_1.__importDefault(require("./Controller"));
const Responses_1 = require("../Responses");
class ResourceRestoreController extends Controller_1.default {
    /**
     * Default route handler
     */
    async __invoke(request) {
        const repository = request.repository();
        const resource = request.newResource(await request
            .resource()
            .detailQuery(request, request.findModelQuery())
            .first());
        await resource.authorizeTo(request, Authorizable_1.Ability.restore);
        await repository.transaction(async () => {
            const model = await repository.restore(request.route('resourceId'));
            const actionReposiory = resource.actionRepository(request);
            await actionReposiory.store(actionReposiory.forResourceRestore(request, model));
        });
        return new Responses_1.EmptyResponse();
    }
}
exports.default = ResourceRestoreController;

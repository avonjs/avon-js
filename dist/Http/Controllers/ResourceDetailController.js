"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Authorizable_1 = require("../../Mixins/Authorizable");
const Controller_1 = tslib_1.__importDefault(require("./Controller"));
const ResourceDetailResponse_1 = tslib_1.__importDefault(require("../Responses/ResourceDetailResponse"));
const ModelNotFoundException_1 = tslib_1.__importDefault(require("../../Exceptions/ModelNotFoundException"));
class ResourceDetailController extends Controller_1.default {
    /**
     * Default route handler
     */
    async __invoke(request) {
        const model = await request
            .resource()
            .detailQuery(request, request.findModelQuery())
            .first();
        ModelNotFoundException_1.default.when(model === undefined);
        const resource = request.newResource(model);
        await resource.authorizeTo(request, Authorizable_1.Ability.view);
        await Promise.all(resource
            .detailFields(request, model)
            .withOnlyRelatableFields()
            .map(async (field) => await field.resolveRelatables(request, [model])));
        return new ResourceDetailResponse_1.default(await resource.serializeForDetail(request));
    }
}
exports.default = ResourceDetailController;

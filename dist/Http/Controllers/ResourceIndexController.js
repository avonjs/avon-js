"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Controller_1 = tslib_1.__importDefault(require("./Controller"));
const ResourceIndexResponse_1 = tslib_1.__importDefault(require("../Responses/ResourceIndexResponse"));
const Authorizable_1 = require("../../Mixins/Authorizable");
class ResourceIndexController extends Controller_1.default {
    /**
     * Default route handler
     */
    async __invoke(request) {
        const resource = request.resource();
        await resource.authorizeTo(request, Authorizable_1.Ability.viewAny);
        const { resources, count } = await request.searchIndex();
        return new ResourceIndexResponse_1.default(resources, {
            count,
            currentPage: request.currentPage(),
            perPage: request.perPage(),
            perPageOptions: resource.perPageOptions(),
        });
    }
}
exports.default = ResourceIndexController;

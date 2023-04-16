"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Controller_1 = tslib_1.__importDefault(require("./Controller"));
const ResourceAssociationResponse_1 = tslib_1.__importDefault(require("../Responses/ResourceAssociationResponse"));
const Authorizable_1 = require("../../Mixins/Authorizable");
const FieldNotFoundException_1 = tslib_1.__importDefault(require("../../Exceptions/FieldNotFoundException"));
class AssociatableController extends Controller_1.default {
    /**
     * Default route handler
     */
    async __invoke(request) {
        const resource = request.resource();
        const field = resource
            .availableFieldsOnForms(request)
            .withOnlyRelatableFields()
            .findFieldByAttribute(request.route('field'));
        FieldNotFoundException_1.default.when(field === undefined);
        const realtionship = field;
        const repository = await realtionship.searchAssociatable(request, request.query('withTrashed') === 'true');
        const { items, count } = await repository.search(request.string('search', ''), request.currentPage(), realtionship.relatedResource.relatableSearchResults);
        const relatedResource = (resource) => {
            return new realtionship.relatedResource.constructor.prototype.constructor(resource);
        };
        const resources = await Promise.all(items
            .map((item) => relatedResource(item))
            .filter((associatable) => {
            return resource.authorizedTo(request, Authorizable_1.Ability.add, [associatable]);
        }));
        return new ResourceAssociationResponse_1.default(resources.map((resource) => {
            return resource.serializeForAssociation(request);
        }), {
            count,
            currentPage: request.currentPage(),
            perPage: realtionship.relatedResource.relatableSearchResults,
            perPageOptions: [realtionship.relatedResource.relatableSearchResults],
        });
    }
}
exports.default = AssociatableController;

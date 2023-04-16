"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvonRequest = exports.RequestTypes = void 0;
const tslib_1 = require("tslib");
const Avon_1 = tslib_1.__importDefault(require("../../Avon"));
const FormRequest_1 = tslib_1.__importDefault(require("./FormRequest"));
const ModelNotFoundException_1 = tslib_1.__importDefault(require("../../Exceptions/ModelNotFoundException"));
const ResourceNotFoundException_1 = tslib_1.__importDefault(require("../../Exceptions/ResourceNotFoundException"));
var RequestTypes;
(function (RequestTypes) {
    RequestTypes["ResourceCreateOrAttachRequest"] = "ResourceCreateOrAttachRequest";
    RequestTypes["ResourceUpdateOrUpdateAttachedRequest"] = "ResourceUpdateOrUpdateAttachedRequest";
    RequestTypes["ResourceIndexRequest"] = "ResourceIndexRequest";
    RequestTypes["ResourceDetailRequest"] = "ResourceDetailRequest";
    RequestTypes["ResourceDeleteRequest"] = "ResourceDeleteRequest";
    RequestTypes["ResourceRestoreRequest"] = "ResourceRestoreRequest";
    RequestTypes["ActionRequest"] = "ActionRequest";
    RequestTypes["AssociatableRequest"] = "AssociatableRequest";
    RequestTypes["SchemaRequest"] = "SchemaRequest";
})(RequestTypes = exports.RequestTypes || (exports.RequestTypes = {}));
class AvonRequest extends FormRequest_1.default {
    /**
     * Determine if this request is a create or attach request.
     */
    isCreateOrAttachRequest() {
        return (this.type() === RequestTypes.ResourceCreateOrAttachRequest ||
            (this.query('editing') === 'true' &&
                ['create', 'attach'].includes(this.query('editMode'))));
    }
    /**
     * Determine if this request is an update or update-attached request.
     */
    isUpdateOrUpdateAttachedRequest() {
        return (this.type() === RequestTypes.ResourceUpdateOrUpdateAttachedRequest ||
            (this.query('editing') === 'true' &&
                ['update', 'update-attached'].includes(this.query('editMode'))));
    }
    /**
     * Determine if this request is a resource index request.
     */
    isResourceIndexRequest() {
        return this.type() === RequestTypes.ResourceIndexRequest;
    }
    /**
     * Determine if this request is a resource detail request.
     *
     * @return bool
     */
    isResourceDetailRequest() {
        return this.type() === RequestTypes.ResourceDetailRequest;
    }
    /**
     * Determine if this request is a resource association request.
     *
     * @return bool
     */
    isResourceAssociationRequest() {
        return this.type() === RequestTypes.AssociatableRequest;
    }
    /**
     * Determine if this request is an action request.
     */
    isActionRequest() {
        return this.type() === RequestTypes.ActionRequest;
    }
    /**
     * Determine if this request is an schema request.
     */
    isSchemaRequest() {
        return this.type() === RequestTypes.SchemaRequest;
    }
    /**
     * Determine if this request is either create, attach, update, update-attached or action request.
     */
    isFormRequest() {
        return (this.isCreateOrAttachRequest() ||
            this.isUpdateOrUpdateAttachedRequest() ||
            this.isActionRequest());
    }
    /**
     * Determine if this request is an index or detail request.
     */
    isPresentationRequest() {
        return this.isResourceIndexRequest() || this.isResourceDetailRequest();
    }
    /**
     * Determine if the requested resource is soft deleting.
     */
    resourceSoftDeletes() {
        return this.resource().softDeletes();
    }
    /**
     * Get the resource instance for the request or abort.
     */
    resource() {
        const resource = Avon_1.default.resourceForKey(this.route('resourceName'));
        ResourceNotFoundException_1.default.when(resource === undefined);
        return resource;
    }
    /**
     * Get the repository for resource being requested.
     */
    repository() {
        return this.resource().repository();
    }
    /**
     * Get the model for resource being requested.
     */
    model() {
        return this.repository().model();
    }
    /**
     * Create new instance of the resource being requested for given item.
     */
    newResource(resource) {
        const resourceClass = this.resource().constructor;
        return new resourceClass.prototype.constructor(resource);
    }
    /**
     * Find the resource instance for the request or abort.
     */
    async findResourceOrFail(resourceId) {
        return this.newResource(await this.findModelOrFail(resourceId));
    }
    /**
     * Find the resource instance for the request.
     */
    async findResource(resourceId) {
        return this.newResource(await this.findModel(resourceId));
    }
    /**
     * Find the model instance for the request or throw an exception.
     */
    async findModelOrFail(resourceId) {
        const item = await this.findModel(resourceId);
        ModelNotFoundException_1.default.when(item === undefined);
        return item;
    }
    /**
     * Find the model instance for the request.
     */
    async findModel(resourceId) {
        return await this.findModelQuery(resourceId).first();
    }
    /**
     * Find the model instance for the request.
     */
    findModelQuery(resourceId) {
        return this.repository().whereKey(resourceId ?? this.route('resourceId') ?? this.query('resourceId'));
    }
}
exports.AvonRequest = AvonRequest;

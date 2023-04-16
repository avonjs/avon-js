import FormRequest from './FormRequest';
import type Repository from '../../Repositories/Repository';
import { type Model } from '../../Models';
import { type Resource } from '../..';
export declare enum RequestTypes {
    ResourceCreateOrAttachRequest = "ResourceCreateOrAttachRequest",
    ResourceUpdateOrUpdateAttachedRequest = "ResourceUpdateOrUpdateAttachedRequest",
    ResourceIndexRequest = "ResourceIndexRequest",
    ResourceDetailRequest = "ResourceDetailRequest",
    ResourceDeleteRequest = "ResourceDeleteRequest",
    ResourceRestoreRequest = "ResourceRestoreRequest",
    ActionRequest = "ActionRequest",
    AssociatableRequest = "AssociatableRequest",
    SchemaRequest = "SchemaRequest"
}
export declare abstract class AvonRequest extends FormRequest {
    /**
     * Indicates type of the request instance.
     */
    abstract type(): RequestTypes;
    /**
     * Determine if this request is a create or attach request.
     */
    isCreateOrAttachRequest(): boolean;
    /**
     * Determine if this request is an update or update-attached request.
     */
    isUpdateOrUpdateAttachedRequest(): boolean;
    /**
     * Determine if this request is a resource index request.
     */
    isResourceIndexRequest(): boolean;
    /**
     * Determine if this request is a resource detail request.
     *
     * @return bool
     */
    isResourceDetailRequest(): boolean;
    /**
     * Determine if this request is a resource association request.
     *
     * @return bool
     */
    isResourceAssociationRequest(): boolean;
    /**
     * Determine if this request is an action request.
     */
    isActionRequest(): boolean;
    /**
     * Determine if this request is an schema request.
     */
    isSchemaRequest(): boolean;
    /**
     * Determine if this request is either create, attach, update, update-attached or action request.
     */
    isFormRequest(): boolean;
    /**
     * Determine if this request is an index or detail request.
     */
    isPresentationRequest(): boolean;
    /**
     * Determine if the requested resource is soft deleting.
     */
    resourceSoftDeletes(): boolean;
    /**
     * Get the resource instance for the request or abort.
     */
    resource(): Resource;
    /**
     * Get the repository for resource being requested.
     */
    repository(): Repository;
    /**
     * Get the model for resource being requested.
     */
    model(): Model;
    /**
     * Create new instance of the resource being requested for given item.
     */
    newResource(resource?: Model): Resource;
    /**
     * Find the resource instance for the request or abort.
     */
    findResourceOrFail(resourceId?: number): Promise<Resource>;
    /**
     * Find the resource instance for the request.
     */
    findResource(resourceId?: number): Promise<Resource | undefined>;
    /**
     * Find the model instance for the request or throw an exception.
     */
    findModelOrFail(resourceId?: number): Promise<Model>;
    /**
     * Find the model instance for the request.
     */
    findModel(resourceId?: number): Promise<Model | undefined>;
    /**
     * Find the model instance for the request.
     */
    findModelQuery(resourceId?: number): Repository;
}
//# sourceMappingURL=AvonRequest.d.ts.map
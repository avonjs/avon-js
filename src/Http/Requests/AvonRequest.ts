import Avon from '../../Avon';
import FormRequest from './FormRequest';
import ModelNotFoundException from '../../Exceptions/ModelNotFoundException';
import type Repository from '../../Repositories/Repository';
import ResourceNotFoundException from '../../Exceptions/ResourceNotFoundException';
import { type Model } from '../../Models';
import { type Resource } from '../..';

export enum RequestTypes {
  ResourceCreateOrAttachRequest = 'ResourceCreateOrAttachRequest',
  ResourceUpdateOrUpdateAttachedRequest = 'ResourceUpdateOrUpdateAttachedRequest',
  ResourceIndexRequest = 'ResourceIndexRequest',
  ResourceDetailRequest = 'ResourceDetailRequest',
  ResourceDeleteRequest = 'ResourceDeleteRequest',
  ResourceRestoreRequest = 'ResourceRestoreRequest',
  ActionRequest = 'ActionRequest',
  AssociatableRequest = 'AssociatableRequest',
  SchemaRequest = 'SchemaRequest',
}

export abstract class AvonRequest extends FormRequest {
  /**
   * Indicates type of the request instance.
   */
  abstract type(): RequestTypes;

  /**
   * Determine if this request is a create or attach request.
   */
  public isCreateOrAttachRequest(): boolean {
    return (
      this.type() === RequestTypes.ResourceCreateOrAttachRequest ||
      (this.query('editing') === 'true' &&
        ['create', 'attach'].includes(this.query('editMode')))
    );
  }

  /**
   * Determine if this request is an update or update-attached request.
   */
  public isUpdateOrUpdateAttachedRequest(): boolean {
    return (
      this.type() === RequestTypes.ResourceUpdateOrUpdateAttachedRequest ||
      (this.query('editing') === 'true' &&
        ['update', 'update-attached'].includes(this.query('editMode')))
    );
  }

  /**
   * Determine if this request is a resource index request.
   */
  public isResourceIndexRequest(): boolean {
    return this.type() === RequestTypes.ResourceIndexRequest;
  }

  /**
   * Determine if this request is a resource detail request.
   *
   * @return bool
   */
  public isResourceDetailRequest(): boolean {
    return this.type() === RequestTypes.ResourceDetailRequest;
  }

  /**
   * Determine if this request is a resource association request.
   *
   * @return bool
   */
  public isResourceAssociationRequest(): boolean {
    return this.type() === RequestTypes.AssociatableRequest;
  }

  /**
   * Determine if this request is an action request.
   */
  public isActionRequest(): boolean {
    return this.type() === RequestTypes.ActionRequest;
  }

  /**
   * Determine if this request is an schema request.
   */
  public isSchemaRequest(): boolean {
    return this.type() === RequestTypes.SchemaRequest;
  }

  /**
   * Determine if this request is either create, attach, update, update-attached or action request.
   */
  public isFormRequest(): boolean {
    return (
      this.isCreateOrAttachRequest() ||
      this.isUpdateOrUpdateAttachedRequest() ||
      this.isActionRequest()
    );
  }

  /**
   * Determine if this request is an index or detail request.
   */
  public isPresentationRequest(): boolean {
    return this.isResourceIndexRequest() || this.isResourceDetailRequest();
  }

  /**
   * Determine if the requested resource is soft deleting.
   */
  public resourceSoftDeletes(): boolean {
    return this.resource().softDeletes();
  }

  /**
   * Get the resource instance for the request or abort.
   */
  public resource(): Resource {
    const resource = Avon.resourceForKey(this.route('resourceName'));

    ResourceNotFoundException.when(resource === undefined);

    return resource as Resource;
  }

  /**
   * Get the repository for resource being requested.
   */
  public repository(): Repository {
    return this.resource().repository();
  }

  /**
   * Get the model for resource being requested.
   */
  public model(): Model {
    return this.repository().model();
  }

  /**
   * Create new instance of the resource being requested for given item.
   */
  public newResource(resource?: Model): Resource {
    const resourceClass = this.resource().constructor;

    return new resourceClass.prototype.constructor(resource);
  }

  /**
   * Find the resource instance for the request or abort.
   */
  public async findResourceOrFail(resourceId?: number): Promise<Resource> {
    return this.newResource(await this.findModelOrFail(resourceId));
  }

  /**
   * Find the resource instance for the request.
   */
  public async findResource(
    resourceId?: number,
  ): Promise<Resource | undefined> {
    return this.newResource(await this.findModel(resourceId));
  }

  /**
   * Find the model instance for the request or throw an exception.
   */
  public async findModelOrFail(resourceId?: number): Promise<Model> {
    const item = await this.findModel(resourceId);

    ModelNotFoundException.when(item === undefined);

    return item as Model;
  }

  /**
   * Find the model instance for the request.
   */
  public async findModel(resourceId?: number): Promise<Model | undefined> {
    return await this.findModelQuery(resourceId).first();
  }

  /**
   * Find the model instance for the request.
   */
  public findModelQuery(resourceId?: number): Repository {
    return this.repository().whereKey(
      resourceId ?? this.route('resourceId') ?? this.query('resourceId'),
    );
  }
}

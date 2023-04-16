import { type AvonRequest } from '../Http/Requests';
import type Field from '../Fields/Field';
import FieldCollection from '../Collections/FieldCollection';
import ID from '../Fields/ID';
import { type AbstractMixable, type Mixable } from './Mixable';
import { type Model } from '../Models';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default <Tbase extends Mixable | AbstractMixable = Mixable>(
  Parent: Tbase,
) => {
  return class ResolvesFields extends Parent {
    [x: string]: any;

    /**
     * Resolve the index fields.
     */
    public indexFields(request: AvonRequest, resource: Model): FieldCollection {
      return this.availableFields(request)
        .filterForIndex(request, resource)
        .authorized(request)
        .resolveForDisplay(resource);
    }

    /**
     * Resolve the detail fields.
     */
    public detailFields(
      request: AvonRequest,
      resource: Model,
    ): FieldCollection {
      return this.availableFields(request)
        .filterForDetail(request, resource)
        .authorized(request)
        .resolveForDisplay(resource);
    }

    /**
     * Resolve the creation fields.
     */
    public creationFields(request: AvonRequest): FieldCollection {
      return this.availableFields(request)
        .authorized(request)
        .onlyCreateFields(request)
        .resolve(this.resource);
    }

    /**
     * Resolve the update fields.
     */
    public updateFields(request: AvonRequest): FieldCollection {
      return this.resolveFields(request).onlyUpdateFields(
        request,
        this.resource,
      );
    }

    /**
     * Resolve the association fields.
     */
    public associationFields(request: AvonRequest): FieldCollection {
      return this.resolveFields(request)
        .filterForIndex(request, this.rsource)
        .withoutUnresolvableFields()
        .withoutRelatableFields();
    }

    /**
     * Resolve the prunable fields.
     */
    // public prunableFields(
    //   request: AvonRequest,
    //   skipSoftDeletes = true,
    // ): FieldCollection<Field> {
    //   return this.availableFieldsOnIndexOrDetail(request)
    //     .filter((field) => {
    //       if (skipSoftDeletes && request.resourceSoftDeletes()) {
    //         return false;
    //       }

    //       return field.isPrunable();
    //     })
    //     .unique('attribute')
    //     .authorized(request)
    //     .resolveForDisplay(this.resource);
    // }

    /**
     * Resolve the filterable fields.
     */
    public filterableFields(request: AvonRequest): FieldCollection<Field> {
      return this.availableFieldsOnIndexOrDetail(request)
        .withOnlyFilterableFields()
        .authorized(request);
    }

    /**
     * Resolve the orderable fields.
     */
    public orderableFields(request: AvonRequest): FieldCollection<Field> {
      return this.availableFieldsOnIndexOrDetail(request)
        .withOnlyOrderableFields()
        .authorized(request);
    }

    /**
     * Get the fields for the given request.
     */
    public resolveFields(request: AvonRequest): FieldCollection {
      return this.availableFields(request).resolve(this.resource);
    }

    /**
     * Get the fields that are available for the given request.
     */
    public availableFields(request: AvonRequest): FieldCollection {
      const fieldsMethod = this.fieldsMethod(request);

      return new FieldCollection(this[fieldsMethod](request));
    }

    /**
     * Get the fields that are available on "index" or "detail" for the given request.
     */
    public availableFieldsOnIndexOrDetail(
      request: AvonRequest,
    ): FieldCollection {
      return this.buildAvailableFields(request, [
        'fieldsForIndex',
        'fieldsForDetail',
      ]);
    }

    /**
     * Get the fields that are available on "forms" for the given request.
     */
    public availableFieldsOnForms(request: AvonRequest): FieldCollection {
      return this.buildAvailableFields(request, [
        'fieldsForCreate',
        'fieldsForUpdate',
      ]);
    }

    /**
     * Get the fields that are available for the given request.
     */
    public buildAvailableFields(
      request: AvonRequest,
      methods: string[],
    ): FieldCollection {
      return new FieldCollection([
        ...this.fields(request),
        ...methods.flatMap((method) => this[method](request)),
      ]);
    }

    /**
     * Compute the method to use to get the available fields.
     */
    public fieldsMethod(request: AvonRequest): string {
      if (request.isResourceIndexRequest()) {
        return 'fieldsForIndex';
      }

      if (request.isResourceDetailRequest()) {
        return 'fieldsForDetail';
      }

      if (request.isCreateOrAttachRequest()) {
        return 'fieldsForCreate';
      }

      if (request.isUpdateOrUpdateAttachedRequest()) {
        return 'fieldsForUpdate';
      }

      if (request.isResourceAssociationRequest()) {
        return 'fieldsForAssociation';
      }

      return 'fields';
    }

    /**
     * Get the fields available on the entity.
     */
    public fields(request: AvonRequest): Field[] {
      return [new ID().filterable().orderable()];
    }

    /**
     * Get the fields available on the entity.
     */
    public fieldsForCreate(request: AvonRequest): Field[] {
      return this.fields(request);
    }

    /**
     * Get the fields available on the entity.
     */
    public fieldsForUpdate(request: AvonRequest): Field[] {
      return this.fields(request);
    }

    /**
     * Get the fields available on the entity.
     */
    public fieldsForIndex(request: AvonRequest): Field[] {
      return this.fields(request);
    }

    /**
     * Get the fields available on the entity.
     */
    public fieldsForDetail(request: AvonRequest): Field[] {
      return this.fields(request);
    }

    /**
     * Get the fields available on the entity.
     */
    public fieldsForAssociation(request: AvonRequest): Field[] {
      return this.fields(request);
    }
  };
};

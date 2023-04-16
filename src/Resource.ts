import Authorizable, { Ability } from './Mixins/Authorizable';
import { plural, singular } from 'pluralize';

import ActionEvent from './Repositories/ActionEvent';
import { type AvonRequest } from './Http/Requests';
import type Field from './Fields/Field';
import FillsFields from './Mixins/FillsFields';
import Fluent from './Models/Fluent';
import HasLifecycleMethods from './Mixins/HasLifecycleMethods';
import { type Model } from './Models';
import PerformsQueries from './Mixins/PerformsQueries';
import PerformsValidation from './Mixins/PerformsValidation';
import type Repository from './Repositories/Repository';
import ResolvesActions from './Mixins/ResolvesActions';
import ResolvesFields from './Mixins/ResolvesFields';
import ResolvesFilters from './Mixins/ResolvesFilters';
import ResolvesOrderings from './Mixins/ResolvesOrderings';
import ResourceSchema from './Mixins/ResourceSchema';
import { slugify } from './helpers';

export interface IndexSerilizedResource {
  fields: Record<string, any>;
  athorization: {
    authorizedToView: boolean;
    authorizedToUpdate: boolean;
    authorizedToDelete: boolean;
    authorizedToForceDelete?: boolean;
    authorizedToRestore?: boolean;
  };
}

export interface DetailSerilizedResource {
  fields: Record<string, any>;
  athorization: {
    authorizedToUpdate: boolean;
    authorizedToDelete: boolean;
    authorizedToForceDelete?: boolean;
    authorizedToRestore?: boolean;
  };
}

export default abstract class Resource extends ResourceSchema(
  HasLifecycleMethods(
    FillsFields(
      ResolvesFields(
        Authorizable(
          ResolvesActions(
            ResolvesOrderings(
              ResolvesFilters(PerformsQueries(PerformsValidation(class {}))),
            ),
          ),
        ),
      ),
    ),
  ),
) {
  /**
   * Indicates related resource model.
   */
  public resource: Model = new Fluent();

  /**
   * The number of results to display when searching relatable resource.
   */
  public relatableSearchResults: number = 10;

  constructor(resource?: Model) {
    super();
    this.resource = resource ?? this.repository().model();
  }

  /**
   * Get the uri-key name of the resource
   */
  public uriKey(): string {
    return slugify(plural(singular(this.constructor.name)));
  }

  /**
   * Get the pagination per-page values
   */
  public perPageOptions(): number[] {
    return [15, 25, 50];
  }

  /**
   * Build an "index" query for the given resource.
   */
  public indexQuery(request: AvonRequest, repository: Repository): Repository {
    return repository;
  }

  /**
   * Build a "detail" query for the given resource.
   */
  public detailQuery(request: AvonRequest, repository: Repository): Repository {
    return repository;
  }

  /**
   * Prepare the resource for JSON serialization.
   */
  public async serializeForIndex(
    request: AvonRequest,
  ): Promise<IndexSerilizedResource> {
    return {
      athorization: {
        authorizedToView: await this.authorizedTo(request, Ability.view),
        authorizedToUpdate: await this.authorizedTo(request, Ability.update),
        authorizedToDelete: await this.authorizedTo(request, Ability.delete),
        authorizedToForceDelete: this.softDeletes()
          ? await this.authorizedTo(request, Ability.forceDelete)
          : undefined,
        authorizedToRestore: this.softDeletes()
          ? await this.authorizedTo(request, Ability.restore)
          : undefined,
      },
      fields: this.indexFields(request, this.resource)
        .withoutUnresolvableFields()
        .mapWithKeys((field: Field) => [
          field.attribute,
          field.getValue(request),
        ])
        .all(),
    };
  }

  /**
   * Prepare the resource for JSON serialization.
   */
  public serializeForAssociation(request: AvonRequest): Record<string, any> {
    return this.associationFields(request)
      .mapWithKeys((field: Field) => [field.attribute, field.getValue(request)])
      .all();
  }

  /**
   * Prepare the resource for JSON serialization.
   */
  public async serializeForDetail(
    request: AvonRequest,
  ): Promise<DetailSerilizedResource> {
    return {
      athorization: {
        authorizedToUpdate: await this.authorizedTo(request, Ability.update),
        authorizedToDelete: await this.authorizedTo(request, Ability.delete),
        authorizedToForceDelete: this.softDeletes()
          ? await this.authorizedTo(request, Ability.forceDelete)
          : undefined,
        authorizedToRestore: this.softDeletes()
          ? await this.authorizedTo(request, Ability.restore)
          : undefined,
      },
      fields: this.detailFields(request, this.resource)
        .withoutUnresolvableFields()
        .mapWithKeys((field: Field) => [
          field.attribute,
          field.getValue(request),
        ]),
    };
  }

  /**
   * Get the action-event repository.
   */
  public actionRepository(request: AvonRequest): ActionEvent {
    return new (class extends ActionEvent {})();
  }

  /**
   * Determine if this resource uses soft deletes.
   */
  public softDeletes(): boolean {
    return (
      typeof this.repository().withTrashed === 'function' &&
      typeof this.repository().onlyTrashed === 'function' &&
      typeof this.repository().applySoftDelete === 'function'
    );
  }

  /**
   * Get the repository.
   */
  public abstract repository(): Repository;
}

import { type AbstractMixable, type Mixable } from './Mixable';
import { type OpenAPIV3 } from 'openapi-types';
import { slugify } from '../helpers';
import { plural } from 'pluralize';
import { TrashedStatus } from './SoftDeletes';
import { type AvonRequest } from '../Http/Requests';
import type Field from '../Fields/Field';
import collect, { type Collection } from 'collect.js';
import Filter from '../Filters/Filter';
import Ordering from '../Orderings/Ordering';
import type Relation from '../Fields/Relation';
import { type Action } from '../Actions';
import FieldCollection from '../Collections/FieldCollection';

export default <Tbase extends Mixable | AbstractMixable = Mixable>(
  Parent: Tbase,
): Tbase => {
  /**
   * @see {@link Resource}
   */
  return class ResourceSchema extends Parent {
    [x: string]: any;

    /**
     * Indicates resource is available for `index` API.
     */
    public availableForIndex = true;

    /**
     * Indicates resource is available for `detail` API.
     */
    public availableForDetail = true;

    /**
     * Indicates resource is available for `create` API.
     */
    public availableForCreation = true;

    /**
     * Indicates resource is available for `update` API.
     */
    public availableForUpdate = true;

    /**
     * Indicates resource is available for `delete` API.
     */
    public availableForDelete = true;

    /**
     * Indicates resource is available for `force delete` API.
     */
    public availableForForceDelete = true;

    /**
     * Indicates resource is available for `restore` API.
     */
    public availableForRestore = true;

    /**
     * Get the Open API json schema.
     */
    public schema(request: AvonRequest): OpenAPIV3.PathsObject {
      const paths = this.apis(request);

      return {
        [paths.index]: {
          ...this.resourceIndexSchema(request),
          ...this.resourceStoreSchema(request),
        },
        [paths.detail]: {
          ...this.resourceDetailSchema(request),
          ...this.resourceUpdateSchema(request),
          ...this.resourceDeleteSchema(request),
        },
        [paths.restore]: {
          ...this.resourceRestoreSchema(request),
        },
        [paths.forceDelete]: {
          ...this.resourceForceDeleteSchema(request),
        },
        ...this.actionsSchema(request),
        ...this.associationSchema(request),
      };
    }

    public resourceIndexSchema(
      request: AvonRequest,
    ): OpenAPIV3.PathItemObject | undefined {
      if (this.availableForIndex) {
        return {
          get: {
            tags: [this.uriKey()],
            description: `Get list of available ${this.label()}`,
            operationId: `index`,
            parameters: [
              ...this.searchParameters(request),
              ...this.paginationParameters(request),
              ...this.softDeleteParameters(request),
              ...this.filteringParameters(request),
              ...this.orderingParameters(request),
            ],
            responses: {
              ...this.authorizationResponses(),
              ...this.errorsResponses(),
              200: {
                description: `Get list of available ${this.label()}`,
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        data: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              athorization: {
                                type: 'object',
                                properties: {
                                  authorizedToView: {
                                    type: 'boolean',
                                    default: true,
                                    description:
                                      'Determines user authorized to view the resource detail',
                                  },
                                  authorizedToUpdate: {
                                    type: 'boolean',
                                    default: true,
                                    description:
                                      'Determines user authorized to update the resource',
                                  },
                                  authorizedToDelete: {
                                    type: 'boolean',
                                    default: true,
                                    description:
                                      'Determines user authorized to delete the resource',
                                  },
                                  authorizedToForceDelete: {
                                    type: 'boolean',
                                    default: true,
                                    description:
                                      'Determines user authorized to force-delete the resource',
                                  },
                                  authorizedToRestore: {
                                    type: 'boolean',
                                    default: true,
                                    description:
                                      'Determines user authorized to restore the resource',
                                  },
                                },
                              },
                              fields: {
                                type: 'object',
                                properties: this.formatSchemas(
                                  request,
                                  this.availableFields(request)
                                    .filterForIndex(request, this.resource)
                                    .all(),
                                ),
                              },
                            },
                          },
                        },
                        meta: {
                          type: 'object',
                          properties: {
                            count: {
                              type: 'integer',
                            },
                            page: {
                              type: 'integer',
                            },
                            perPage: {
                              type: 'integer',
                            },
                            perPageOptions: {
                              type: 'array',
                              uniqueItems: true,
                              items: {
                                type: 'integer',
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        };
      }
    }

    /**
     * Get the searching parameters for index schema.
     */
    public searchParameters(request: AvonRequest): OpenAPIV3.ParameterObject[] {
      return [
        {
          name: 'search',
          in: 'query',
          description: 'Enter value to search through records',
          schema: {
            type: 'string',
            nullable: true,
          },
        },
      ];
    }

    /**
     * Get pagination parameters for index schema.
     */
    public paginationParameters(
      request: AvonRequest,
    ): OpenAPIV3.ParameterObject[] {
      return [
        {
          name: 'page',
          in: 'query',
          description: 'The pagination page',
          example: 1,
          schema: {
            type: 'integer',
            minimum: 1,
            nullable: true,
          },
        },
        {
          name: 'perPage',
          in: 'query',
          description: 'Number of items per page',
          example: this.perPageOptions()[0],
          schema: {
            type: 'number',
            nullable: true,
            enum: this.perPageOptions(),
          },
        },
      ];
    }

    /**
     * Get soft delete resource parameters for schema.
     */
    public softDeleteParameters(
      request: AvonRequest,
    ): OpenAPIV3.ParameterObject[] {
      return this.softDeletes() === false
        ? []
        : [
            {
              name: 'trashed',
              in: 'query',
              description: 'Determine trashed items behavior',
              example: TrashedStatus.DEFAULT,
              schema: {
                type: 'string',
                nullable: false,
                enum: [
                  TrashedStatus.WITH,
                  TrashedStatus.ONLY,
                  TrashedStatus.DEFAULT,
                ],
              },
            },
          ];
    }

    /**
     * Get ordering parameters.
     */
    public orderingParameters(
      request: AvonRequest,
    ): OpenAPIV3.ParameterObject[] {
      const orderings: Collection<Ordering> = collect(
        this.resolveOrderings(request),
      );

      this.availableFieldsOnIndexOrDetail(request)
        .withOnlyOrderableFields()
        .each((field: Field) => {
          const ordering = field.resolveOrdering(request);

          if (ordering instanceof Ordering) {
            orderings.push(ordering);
          }
        });

      return orderings
        .unique((ordering: Ordering) => ordering.key())
        .all()
        .flatMap((ordering) => ordering.serializeParameters(request));
    }

    /**
     * Get filtering parameters.
     */
    public filteringParameters(
      request: AvonRequest,
    ): OpenAPIV3.ParameterObject[] {
      const filters: Collection<Filter> = collect(this.resolveFilters(request));

      this.availableFieldsOnIndexOrDetail(request)
        .withOnlyFilterableFields()
        .each((field: Field) => {
          const filter = field.resolveFilter(request);

          if (filter instanceof Filter) {
            filters.push(filter);
          }
        });

      return filters
        .unique((filter: Filter) => filter.key())
        .all()
        .flatMap((filter) => filter.serializeParameters(request));
    }

    /**
     * Get resource store schema.
     */
    public resourceStoreSchema(
      request: AvonRequest,
    ): OpenAPIV3.PathItemObject | undefined {
      if (this.availableForCreation) {
        const fields = collect<Field>(this.fieldsForCreate(request)).filter(
          (field: Field) => {
            return field.isShownOnCreation(request) && field.fillable();
          },
        );

        return {
          post: {
            tags: [this.uriKey()],
            description: `Create new record for the given payload`,
            operationId: `store`,
            requestBody: {
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: fields
                      .filter((field) => field.isRequiredForCreation(request))
                      .map((field) => field.attribute)
                      .all(),
                    properties: fields
                      .mapWithKeys((field: Field) => {
                        field.resolve(this.resource);

                        return [field.attribute, field.schema(request)];
                      })
                      .all() as Record<string, any>,
                  },
                },
              },
            },
            responses: {
              ...this.authorizationResponses(),
              ...this.errorsResponses(),
              ...this.validationResponses(),
              201: {
                description: `Get detail of stored ${this.label()}`,
                content: {
                  ...this.singleResourceContent(request),
                },
              },
            },
          },
        };
      }
    }

    /**
     *
     */
    public resourceDetailSchema(
      request: AvonRequest,
    ): OpenAPIV3.PathItemObject | undefined {
      if (this.availableForDelete) {
        return {
          get: {
            tags: [this.uriKey()],
            description: `Get detail of resource by the given ${this.label()} key`,
            operationId: `detail`,
            parameters: [...this.singleResourcePathParamaeters(request)],
            responses: {
              ...this.authorizationResponses(),
              ...this.errorsResponses(),
              200: {
                description: `Get detail of ${this.label()} for given id`,
                content: {
                  ...this.singleResourceContent(request),
                },
              },
            },
          },
        };
      }
    }

    /**
     *
     */
    public resourceUpdateSchema(
      request: AvonRequest,
    ): OpenAPIV3.PathItemObject | undefined {
      if (this.availableForUpdate) {
        const fields = collect<Field>(this.fieldsForCreate(request)).filter(
          (field: Field) => field.isShownOnCreation(request),
        );

        return {
          put: {
            tags: [this.uriKey()],
            description: `Update resource by the given payload`,
            operationId: `update`,
            parameters: [...this.singleResourcePathParamaeters(request)],
            requestBody: {
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: fields
                      .filter((field) => field.isRequiredForCreation(request))
                      .map((field) => field.attribute)
                      .all(),
                    properties: fields
                      .mapWithKeys((field: Field) => {
                        field.resolve(this.resource);

                        return [field.attribute, field.schema(request)];
                      })
                      .all() as Record<string, any>,
                  },
                },
              },
            },
            responses: {
              ...this.authorizationResponses(),
              ...this.errorsResponses(),
              ...this.validationResponses(),
              200: {
                description: `Get detail of updated ${this.label()}`,
                content: {
                  ...this.singleResourceContent(request),
                },
              },
            },
          },
        };
      }
    }

    /**
     *
     */
    public resourceDeleteSchema(
      request: AvonRequest,
    ): OpenAPIV3.PathItemObject | undefined {
      if (this.availableForDelete) {
        return {
          delete: {
            tags: [this.uriKey()],
            description: `Delete ${this.label()} by the given id`,
            operationId: `delete`,
            parameters: [...this.singleResourcePathParamaeters(request)],
            responses: {
              ...this.authorizationResponses(),
              ...this.errorsResponses(),
              204: { $ref: '#/components/responses/EmptyResponse' },
            },
          },
        };
      }
    }

    /**
     *
     */
    public resourceForceDeleteSchema(
      request: AvonRequest,
    ): OpenAPIV3.PathItemObject | undefined {
      if (this.availableForForceDelete && Boolean(this.softDeletes())) {
        return {
          delete: {
            tags: [this.uriKey()],
            description: `Delete ${this.label()} by the given id`,
            operationId: `forceDelete`,
            parameters: [...this.singleResourcePathParamaeters(request)],
            responses: {
              ...this.authorizationResponses(),
              ...this.errorsResponses(),
              204: { $ref: '#/components/responses/EmptyResponse' },
            },
          },
        };
      }
    }

    /**
     *
     */
    public resourceRestoreSchema(
      request: AvonRequest,
    ): OpenAPIV3.PathItemObject | undefined {
      if (this.availableForRestore && Boolean(this.softDeletes())) {
        return {
          put: {
            tags: [this.uriKey()],
            description: `Restore deleted ${this.label()} by id`,
            operationId: `restore`,
            parameters: [...this.singleResourcePathParamaeters(request)],
            responses: {
              ...this.authorizationResponses(),
              ...this.errorsResponses(),
              204: { $ref: '#/components/responses/EmptyResponse' },
            },
          },
        };
      }
    }

    /**
     * Get the Open API json schema for realtionship fields.
     */
    public actionsSchema(request: AvonRequest): OpenAPIV3.PathsObject {
      const actions: Collection<Action> = collect(this.resolveActions(request));
      const paths = this.apis(request);

      return actions
        .mapWithKeys((action: Action): [string, OpenAPIV3.PathItemObject] => {
          const fields = action.fields(request);

          return [
            `${paths.index}/actions/${action.uriKey()}`,
            {
              post: {
                tags: [this.uriKey()],
                description: `Run the ${action.name()} on the given resources`,
                operationId: `${this.uriKey() as string}-${action.uriKey()}`,
                parameters: [
                  {
                    name: 'resources',
                    in: 'query',
                    description: 'Enter record id you want to run action on it',
                    required: !action.isStandalone(),
                    style: 'deepObject',
                    explode: true,
                    schema: {
                      type: 'array',
                      items: {
                        oneOf: [
                          { type: 'number', nullable: false, minLength: 1 },
                          { type: 'string', nullable: false },
                        ],
                      },
                      nullable: false,
                      minItems: action.isStandalone() ? 0 : 1,
                    },
                  },
                ],
                requestBody:
                  fields.length === 0
                    ? undefined
                    : {
                        content: {
                          'application/json': {
                            schema: {
                              type: 'object',
                              required: fields.map((field) => field.attribute),
                              properties: collect(fields)
                                .mapWithKeys((field: Field) => {
                                  field.resolve(this.resource);

                                  return [
                                    field.attribute,
                                    field.schema(request),
                                  ];
                                })
                                .all() as Record<string, any>,
                            },
                          },
                        },
                      },
                responses: {
                  ...this.authorizationResponses(),
                  ...this.errorsResponses(),
                  200: {
                    description: `Action ${action.name()} ran successfully`,
                    content: {
                      'application/json': {
                        schema: action.schema(request),
                      },
                    },
                  },
                },
              },
            },
          ];
        })
        .all() as unknown as Record<
        string,
        OpenAPIV3.PathItemObject | undefined
      >;
    }

    /**
     * Get the Open API json schema for realtionship fields.
     */
    public associationSchema(request: AvonRequest): OpenAPIV3.PathsObject {
      const paths = this.apis(request);

      return this.availableFieldsOnForms(request)
        .withOnlyRelatableFields()
        .withoutUnfillableFields()
        .mapWithKeys((field: Relation) => {
          const relatable = field.relatedResource;

          return [
            `${paths.index}/associatable/${field.attribute}`,
            {
              get: {
                tags: [this.uriKey()],
                description: `Get list of realted ${
                  relatable.label() as string
                }`,

                operationId: field.attribute,
                parameters: [
                  ...relatable.searchParameters(request),
                  ...relatable.paginationParameters(request),
                  ...relatable.softDeleteParameters(request),
                ],

                responses: {
                  ...this.authorizationResponses(),
                  ...this.errorsResponses(),
                  200: {
                    description: `Get list of realted ${
                      relatable.label() as string
                    }`,
                    content: {
                      'application/json': {
                        schema: {
                          type: 'object',
                          properties: {
                            data: {
                              type: 'array',
                              items: {
                                type: 'object',
                                properties: relatable.formatSchemas(
                                  request,
                                  relatable
                                    .availableFields(request)
                                    .filterForIndex(request, relatable.resource)
                                    .all(),
                                ),
                              },
                            },
                            meta: {
                              type: 'object',
                              properties: {
                                count: {
                                  type: 'integer',
                                },
                                page: {
                                  type: 'integer',
                                },
                                perPage: {
                                  type: 'integer',
                                },
                                perPageOptions: {
                                  type: 'array',
                                  uniqueItems: true,
                                  items: {
                                    type: 'integer',
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          ];
        })
        .all() as Record<string, OpenAPIV3.PathItemObject | undefined>;
    }

    /**
     * Get the single resource content schema.
     */
    public singleResourceContent(
      request: AvonRequest,
    ): Record<string, OpenAPIV3.MediaTypeObject> {
      return {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                properties: {
                  athorization: {
                    type: 'object',
                    properties: {
                      authorizedToUpdate: {
                        type: 'boolean',
                        default: true,
                        description:
                          'Determines user authorized to update the resource',
                      },
                      authorizedToDelete: {
                        type: 'boolean',
                        default: true,
                        description:
                          'Determines user authorized to delete the resource',
                      },
                      authorizedToForceDelete: {
                        type: 'boolean',
                        default: true,
                        description:
                          'Determines user authorized to force-delete the resource',
                      },
                      authorizedToRestore: {
                        type: 'boolean',
                        default: true,
                        description:
                          'Determines user authorized to restore the resource',
                      },
                    },
                  },
                  fields: {
                    type: 'object',
                    properties: this.formatSchemas(
                      request,
                      this.availableFields(request)
                        .filterForDetail(request, this.resource)
                        .all(),
                    ),
                  },
                },
              },
              meta: {
                type: 'object',
              },
            },
          },
        },
      };
    }

    /**
     * Get the single resource path parameters.
     */
    public singleResourcePathParamaeters(
      request: AvonRequest,
    ): OpenAPIV3.ParameterObject[] {
      return [
        {
          name: 'resourceId',
          in: 'path',
          required: true,
          description: 'The resource primary key',
          example: 1,
          schema: {
            oneOf: [{ type: 'number' }, { type: 'string' }],
          },
        },
      ];
    }

    /**
     * Get the API paths.
     */
    public apis(request: AvonRequest): Record<string, string> {
      const basePath = request.getRequest().baseUrl;
      const resourcePath = `/${basePath}/resources/${String(
        this.uriKey(),
      )}`.replace(/\/{2,}/g, '/');

      return {
        index: resourcePath,
        detail: `${resourcePath}/{resourceId}`,
        restore: `${resourcePath}/{resourceId}/restore`,
        forceDelete: `${resourcePath}/{resourceId}/force`,
        action: `${resourcePath}/actions/{actionName}`,
        association: `${resourcePath}/associatable/{field}`,
      };
    }

    /**
     * Get the schema label.
     */
    public label(): string {
      return plural(slugify(this.constructor.name, ' '));
    }

    /**
     * Format the given schema for responses.
     */
    public formatSchemas(
      request: AvonRequest,
      fields: Field[],
    ): Record<string, OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject> {
      return new FieldCollection(fields)
        .mapWithKeys((field: Field) => [field.attribute, field.schema(request)])
        .all() as unknown as Record<
        string,
        OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject
      >;
    }

    /**
     * name
     */
    public authorizationResponses(): OpenAPIV3.ResponsesObject {
      return {
        // 401: {
        //   $ref: '#/components/responses/Unauthorized',
        // },
        403: {
          $ref: '#/components/responses/Forbidden',
        },
      };
    }

    /**
     * name
     */
    public errorsResponses(): OpenAPIV3.ResponsesObject {
      return {
        404: {
          $ref: '#/components/responses/NotFound',
        },
        500: {
          $ref: '#/components/responses/InternalServerError',
        },
      };
    }

    /**
     * name
     */
    public validationResponses(): OpenAPIV3.ResponsesObject {
      return {
        // 400: {
        //   $ref: '#/components/responses/BadRequest',
        // },
        422: {
          $ref: '#/components/responses/UnprocessableContent',
        },
      };
    }
  };
};

import collect, { type Collection } from 'collect.js';
import ActionEvent from './Resources/ActionEvent';
import { type OpenAPIV3 } from 'openapi-types';
import RouteRegisterar from './Route/RouteRegisterar';
import type { Router } from 'express';
import { cwd } from 'process';
import path from 'path';
import { type AvonRequest } from './Http/Requests';
import { type Resource } from '.';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class Avon {
  /**
   * Indicates application current version.
   */
  static VERSION = '1.0.0';

  /**
   * Array of available resources.
   */
  static resourceInstances: Resource[] = [];

  /**
   * Array of available resources.
   */
  static actionEventInstance = new ActionEvent();

  /**
   * The error handler callback.
   */
  static errorHandler = (error: Error): void => {
    console.log(error);
  };

  /**
   * Register array of new resources.
   */
  public static resources(resources: Resource[] = []): Avon {
    this.resourceInstances = this.resourceInstances.concat(resources);

    return new Avon();
  }

  /**
   * Find resource for given uriKey.
   */
  public static resourceForKey(key?: string): Resource | undefined {
    return this.resourceCollection().first(
      (resource: Resource) => resource.uriKey() === key,
    );
  }

  /**
   * Get collection of available resources.
   */
  public static resourceCollection(): Collection<Resource> {
    return collect(this.resourceInstances).push(this.actionEventInstance);
  }

  /**
   * Register API routes.
   */
  public static routes(router: Router): Router {
    const routes = new RouteRegisterar(router);

    routes.register();

    return router;
  }

  /**
   * Get the log path for the action event storage.
   */
  public static actionEventLogPath(): string {
    return path.join(cwd(), 'logs');
  }

  /**
   * Hanlde the given error.
   */
  public static handleError(error: Error): Avon {
    this.errorHandler(error);

    return new Avon();
  }

  /**
   * Hanlde the given error.
   */
  public static handleErrorUsing(errorHandler: (error: Error) => void): Avon {
    this.errorHandler = errorHandler;

    return new Avon();
  }

  /**
   * Get the schema for open API.
   */
  public static schema(request: AvonRequest): OpenAPIV3.Document {
    return {
      openapi: '3.0.0',
      paths: this.resourceCollection().reduce((paths, resource) => {
        return {
          ...paths,
          ...resource.schema(request),
        };
      }, {}),
      info: {
        title: 'My Application API',
        // description: 'This is a sample server for a pet store.',
        // termsOfService: 'https://example.com/terms/',
        // contact: {
        //   name: 'API Support',
        //   url: 'https://www.example.com/support',
        //   email: 'support@example.com',
        // },
        // license: {},
        version: '1.0.1',
      },
      components: {
        responses: {
          Forbidden: {
            description: 'This action is unauthorized.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    code: { type: 'number', default: 403 },
                    message: {
                      type: 'string',
                      default: 'This action is unauthorized.',
                    },
                    name: { type: 'string', default: 'Forbidden' },
                    meta: {
                      type: 'object',
                      properties: {
                        stack: { type: 'object' },
                      },
                    },
                  },
                },
              },
            },
          },
          NotFound: {
            description: 'Requested reource not found.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    code: { type: 'number', default: 404 },
                    message: {
                      type: 'string',
                      default: 'Requested reource not found.',
                    },
                    name: { type: 'string', default: 'NotFound' },
                    meta: {
                      type: 'object',
                      properties: {
                        stack: { type: 'object' },
                      },
                    },
                  },
                },
              },
            },
          },
          InternalServerError: {
            description: 'Internal server error.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    code: { type: 'number', default: 500 },
                    message: {
                      type: 'string',
                      default: 'Something went wrong.',
                    },
                    name: { type: 'string', default: 'InternalServerError' },
                    meta: {
                      type: 'object',
                      properties: {
                        stack: { type: 'object' },
                      },
                    },
                  },
                },
              },
            },
          },
          UnprocessableContent: {
            description: 'Validation failed.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    code: { type: 'number', default: 422 },
                    message: {
                      type: 'string',
                      default: 'The given data was invalid.',
                    },
                    name: { type: 'string', default: 'UnprocessableContent' },
                    meta: {
                      type: 'object',
                      properties: {
                        errors: { type: 'object' },
                      },
                    },
                  },
                },
              },
            },
          },
          EmptyResponse: {
            description: 'Nothing to show',
            content: {
              'application/json': {},
            },
          },
        },
      },
    };
  }
}

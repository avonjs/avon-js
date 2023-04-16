import Dispatcher from './Dispatcher';
import type { Router } from 'express';

export default class {
  constructor(protected router: Router) {}

  public register(): void {
    this.resourceRoutes();
  }

  protected resourceRoutes(): void {
    // schema
    this.router.get('/schema', Dispatcher.dispatch('SchemaController'));

    // actions API
    this.router.get(
      '/resources/:resourceName/actions',
      Dispatcher.dispatch('ActionIndexController'),
    );
    this.router.post(
      '/resources/:resourceName/actions/:actionName',
      Dispatcher.dispatch('ActionStoreController'),
    );
    // Associatable Resources...
    this.router.get(
      '/resources/:resourceName/associatable/:field',
      Dispatcher.dispatch('AssociatableController'),
    );
    // resources API
    this.router.get(
      '/resources/:resourceName',
      Dispatcher.dispatch('ResourceIndexController'),
    );
    this.router.post(
      '/resources/:resourceName',
      Dispatcher.dispatch('ResourceStoreController'),
    );
    this.router.get(
      '/resources/:resourceName/:resourceId',
      Dispatcher.dispatch('ResourceDetailController'),
    );
    this.router.put(
      '/resources/:resourceName/:resourceId',
      Dispatcher.dispatch('ResourceUpdateController'),
    );
    this.router.delete(
      '/resources/:resourceName/:resourceId',
      Dispatcher.dispatch('ResourceDeleteController'),
    );
    this.router.delete(
      '/resources/:resourceName/:resourceId/force',
      Dispatcher.dispatch('ResourceForceDeleteController'),
    );
    this.router.put(
      '/resources/:resourceName/:resourceId/restore',
      Dispatcher.dispatch('ResourceRestoreController'),
    );
  }
}

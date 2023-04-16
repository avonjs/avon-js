import ForbiddenException from '../Exceptions/ForbiddenException';
import { type AvonRequest } from '../Http/Requests';
import { type AbstractMixable, type Mixable } from './Mixable';

export enum Ability {
  viewAny = 'viewAny',
  create = 'create',
  update = 'update',
  view = 'view',
  delete = 'delete',
  forceDelete = 'forceDelete',
  restore = 'restore',
  add = 'add',
}

export default <Tbase extends Mixable | AbstractMixable = Mixable>(
  Parent: Tbase,
): Tbase => {
  return class Authorizable extends Parent {
    /**
     * Determine if the current user has a given ability or throw exception.
     * @throws {ForbiddenException}
     */
    public async authorizeTo(
      request: AvonRequest,
      ability: Ability,
      args: any[] = [],
    ): Promise<void> {
      ForbiddenException.unless(
        await this.authorizedTo(request, ability, args),
      );
    }

    /**
     * Determine if the current user has a given ability.
     */
    public async authorizedTo(
      request: AvonRequest,
      ability: Ability,
      args: any[] = [],
    ): Promise<boolean> {
      const authorizationCallback =
        this[this.makeAuthorizationCallback(ability) as keyof this];

      return this.authorizable() && typeof authorizationCallback === 'function'
        ? authorizationCallback.apply(this, [request, args])
        : await Promise.resolve(true);
    }

    /**
     * Determine if need to perform authorization.
     */
    public authorizable(): boolean {
      return true;
    }

    /**
     * Guess custom authorization callback name for the given ability.
     */
    public makeAuthorizationCallback(ability: string): string {
      return `authorizedTo${ability[0].toUpperCase()}${ability.substring(1)}`;
    }

    /**
     * Determine if the current user has ability to `viewAny` a resource.
     */
    public authorizedToviewAny(
      request: AvonRequest,
      args: any[] = [],
    ): boolean {
      return true;
    }

    /**
     * Determine if the current user has ability to `view` a resource.
     */
    public authorizedToView(request: AvonRequest, args: any[] = []): boolean {
      return true;
    }

    /**
     * Determine if the current user has ability to `create` a resource.
     */
    public authorizedToCreate(request: AvonRequest, args: any[] = []): boolean {
      return true;
    }

    /**
     * Determine if the current user has ability to `update` a resource.
     */
    public authorizedToUpdate(request: AvonRequest, args: any[] = []): boolean {
      return true;
    }

    /**
     * Determine if the current user has ability to `delete` a resource.
     */
    public authorizedToDelete(request: AvonRequest, args: any[] = []): boolean {
      return true;
    }

    /**
     * Determine if the current user has ability to `forceDelete` a resource.
     */
    public authorizedToForcDelete(
      request: AvonRequest,
      ability: string,
    ): boolean {
      return true;
    }

    /**
     * Determine if the current user has ability to `restore` a resource.
     */
    public authorizedToRestore(
      request: AvonRequest,
      args: any[] = [],
    ): boolean {
      return true;
    }

    /**
     * Determine if the current user has ability to `add` a resource to the current resource.
     */
    public authorizedToAdd(request: AvonRequest, args: any[] = []): boolean {
      return true;
    }
  };
};

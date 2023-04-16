import { type AvonRequest } from '../Http/Requests';
import { type Model } from '../Models';
import { type AbstractMixable, type Mixable } from './Mixable';

export type Callback = ((request: AvonRequest) => boolean) | boolean;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default <Tbase extends Mixable | AbstractMixable = Mixable>(
  Parent: Tbase,
) => {
  return class Presentable extends Parent {
    /**
     * Callback that indicates if the element should be shown on the index api.
     */
    public showOnIndexCallback = (
      request: AvonRequest,
      resource: Model,
    ): boolean => true;

    /**
     * Callback that indicates if the element should be shown on the detail api.
     */
    public showOnDetailCallback = (
      request: AvonRequest,
      resource: Model,
    ): boolean => true;

    /**
     * Callback that indicates if the element should be shown on the creation api.
     */
    public showOnCreationCallback = (request: AvonRequest): boolean => true;

    /**
     * Callback that indicates if the element should be shown on the update api.
     */
    public showOnUpdateCallback = (
      request: AvonRequest,
      resource: Model,
    ): boolean => true;

    /**
     * Make showing callback for given state.
     */
    public showCallback(
      callback: Callback,
    ): (request: AvonRequest, resource?: Model) => boolean {
      return typeof callback !== 'function' ? () => callback : callback;
    }

    /**
     * Make hiding callback for given state.
     */
    public hideCallback(
      callback: Callback,
    ): (request: AvonRequest, resource?: Model) => boolean {
      return (request: AvonRequest, resource?: Model) => {
        const showCallback = this.showCallback(callback);

        return !showCallback(request, resource);
      };
    }

    /**
     * Specify that the element should be hidden from the index view.
     */
    public hideFromIndex(callback: Callback = true): this {
      this.showOnIndexCallback = this.hideCallback(callback);

      return this;
    }

    /**
     * Specify that the element should be hidden from the detail view.
     */
    public hideFromDetail(callback: Callback = true): this {
      this.showOnDetailCallback = this.hideCallback(callback);

      return this;
    }

    /**
     * Specify that the element should be hidden from the creation view.
     */
    public hideWhenCreating(callback: Callback = true): this {
      this.showOnCreationCallback = this.hideCallback(callback);

      return this;
    }

    /**
     * Specify that the element should be hidden from the update view.
     */
    public hideWhenUpdating(callback: Callback = true): this {
      this.showOnUpdateCallback = this.hideCallback(callback);

      return this;
    }

    /**
     * Specify that the element should be visible on the index view.
     */
    public showOnIndex(callback: Callback = true): this {
      this.showOnIndexCallback = this.showCallback(callback);

      return this;
    }

    /**
     * Specify that the element should be hidden from the detail view.
     */
    public showOnDetail(callback: Callback = true): this {
      this.showOnDetailCallback = this.showCallback(callback);

      return this;
    }

    /**
     * Specify that the element should be hidden from the creation view.
     */
    public showOnCreating(callback: Callback = true): this {
      this.showOnCreationCallback = this.showCallback(callback);

      return this;
    }

    /**
     * Specify that the element should be hidden from the update view.
     */
    public showOnUpdating(callback: Callback = true): this {
      this.showOnUpdateCallback = this.showCallback(callback);

      return this;
    }

    /**
     * Check for showing when updating.
     */
    public isShownOnUpdate(request: AvonRequest, resource: Model): boolean {
      return this.showOnUpdateCallback(request, resource);
    }

    /**
     * Check showing on index.
     */
    public isShownOnIndex(request: AvonRequest, resource: Model): boolean {
      return this.showOnIndexCallback(request, resource);
    }

    /**
     * Determine if the field is to be shown on the detail view.
     */
    public isShownOnDetail(request: AvonRequest, resource: Model): boolean {
      return this.showOnDetailCallback(request, resource);
    }

    /**
     * Check for showing when creating.
     */
    public isShownOnCreation(request: AvonRequest): boolean {
      return this.showOnCreationCallback(request);
    }

    /**
     * Specify that the element should only be shown on the index view.
     */
    public onlyOnIndex(): this {
      this.showOnIndex(true);
      this.showOnDetail(false);
      this.showOnCreating(false);
      this.showOnUpdating(false);

      return this;
    }

    /**
     * Specify that the element should only be shown on the detail view.
     */
    public onlyOnDetail(): this {
      this.showOnIndex(false);
      this.showOnDetail(true);
      this.showOnCreating(false);
      this.showOnUpdating(false);

      return this;
    }

    /**
     * Specify that the element should only be shown on forms.
     */
    public onlyOnForms(): this {
      this.showOnIndex(false);
      this.showOnDetail(false);
      this.showOnCreating(true);
      this.showOnUpdating(true);

      return this;
    }

    /**
     * Specify that the element should be hidden from forms.
     */
    public exceptOnForms(): this {
      this.showOnIndex(true);
      this.showOnDetail(true);
      this.showOnCreating(false);
      this.showOnUpdating(false);

      return this;
    }
  };
};

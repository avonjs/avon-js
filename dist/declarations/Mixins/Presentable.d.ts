import { type AvonRequest } from '../Http/Requests';
import { type Model } from '../Models';
import { type AbstractMixable, type Mixable } from './Mixable';
export type Callback = ((request: AvonRequest) => boolean) | boolean;
declare const _default: <Tbase extends Mixable<Record<any, any>> | AbstractMixable<Record<any, any>> = Mixable<Record<any, any>>>(Parent: Tbase) => {
    new (...args: any[]): {
        /**
         * Callback that indicates if the element should be shown on the index api.
         */
        showOnIndexCallback: (request: AvonRequest, resource: Model) => boolean;
        /**
         * Callback that indicates if the element should be shown on the detail api.
         */
        showOnDetailCallback: (request: AvonRequest, resource: Model) => boolean;
        /**
         * Callback that indicates if the element should be shown on the creation api.
         */
        showOnCreationCallback: (request: AvonRequest) => boolean;
        /**
         * Callback that indicates if the element should be shown on the update api.
         */
        showOnUpdateCallback: (request: AvonRequest, resource: Model) => boolean;
        /**
         * Make showing callback for given state.
         */
        showCallback(callback: Callback): (request: AvonRequest, resource?: Model) => boolean;
        /**
         * Make hiding callback for given state.
         */
        hideCallback(callback: Callback): (request: AvonRequest, resource?: Model) => boolean;
        /**
         * Specify that the element should be hidden from the index view.
         */
        hideFromIndex(callback?: Callback): this;
        /**
         * Specify that the element should be hidden from the detail view.
         */
        hideFromDetail(callback?: Callback): this;
        /**
         * Specify that the element should be hidden from the creation view.
         */
        hideWhenCreating(callback?: Callback): this;
        /**
         * Specify that the element should be hidden from the update view.
         */
        hideWhenUpdating(callback?: Callback): this;
        /**
         * Specify that the element should be visible on the index view.
         */
        showOnIndex(callback?: Callback): this;
        /**
         * Specify that the element should be hidden from the detail view.
         */
        showOnDetail(callback?: Callback): this;
        /**
         * Specify that the element should be hidden from the creation view.
         */
        showOnCreating(callback?: Callback): this;
        /**
         * Specify that the element should be hidden from the update view.
         */
        showOnUpdating(callback?: Callback): this;
        /**
         * Check for showing when updating.
         */
        isShownOnUpdate(request: AvonRequest, resource: Model): boolean;
        /**
         * Check showing on index.
         */
        isShownOnIndex(request: AvonRequest, resource: Model): boolean;
        /**
         * Determine if the field is to be shown on the detail view.
         */
        isShownOnDetail(request: AvonRequest, resource: Model): boolean;
        /**
         * Check for showing when creating.
         */
        isShownOnCreation(request: AvonRequest): boolean;
        /**
         * Specify that the element should only be shown on the index view.
         */
        onlyOnIndex(): this;
        /**
         * Specify that the element should only be shown on the detail view.
         */
        onlyOnDetail(): this;
        /**
         * Specify that the element should only be shown on forms.
         */
        onlyOnForms(): this;
        /**
         * Specify that the element should be hidden from forms.
         */
        exceptOnForms(): this;
    };
} & Tbase;
export default _default;
//# sourceMappingURL=Presentable.d.ts.map
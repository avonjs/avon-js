import { type AvonRequest } from '../Http/Requests';
import { type AbstractMixable, type Mixable } from './Mixable';
export type SeeCallback = (request: AvonRequest) => boolean;
declare const _default: <Tbase extends Mixable<Record<any, any>> | AbstractMixable<Record<any, any>> = Mixable<Record<any, any>>>(Parent: Tbase) => {
    new (...args: any[]): {
        /**
         * The callback used to authorize viewing the filter or action.
         */
        seeCallback: SeeCallback;
        /**
         * Determine if the filter or action should be available for the given request.
         */
        authorizedToSee(request: AvonRequest): boolean;
        /**
         * Set the callback to be run to authorize viewing the filter or action.
         */
        canSee(callback: SeeCallback): this;
    };
} & Tbase;
export default _default;
//# sourceMappingURL=AuthorizedToSee.d.ts.map
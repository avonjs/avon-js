import type Action from '../Actions/Action';
import { type AvonRequest } from '../Http/Requests';
import { type AbstractMixable, type Mixable } from './Mixable';
declare const _default: <Tbase extends Mixable<Record<any, any>> | AbstractMixable<Record<any, any>> = Mixable<Record<any, any>>>(Parent: Tbase) => {
    new (...args: any[]): {
        /**
         * Get the actions that are available for the given request.
         */
        availableActions(request: AvonRequest): Action[];
        /**
         * Get the actions for the given request.
         */
        resolveActions(request: AvonRequest): Action[];
        /**
         * Get the actions available on the entity.
         */
        actions(request: AvonRequest): Action[];
    };
} & Tbase;
export default _default;
//# sourceMappingURL=ResolvesActions.d.ts.map
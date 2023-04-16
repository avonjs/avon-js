import { type AvonRequest } from '../Http/Requests';
import Ordering from '../Orderings/Ordering';
import { type AbstractMixable, type Mixable } from './Mixable';
declare const _default: <Tbase extends Mixable<Record<any, any>> | AbstractMixable<Record<any, any>> = Mixable<Record<any, any>>>(Parent: Tbase) => {
    new (...args: any[]): {
        /**
         * Get the orders that are available for the given request.
         */
        availableOrderings(request: AvonRequest): Ordering[];
        /**
         * Get the orders for the given request.
         */
        resolveOrderings(request: AvonRequest): Ordering[];
        /**
         * Get the orders from orderable fields for the given request.
         */
        resolveOrderingsFromFields(request: AvonRequest): Ordering[];
        /**
         * Get the orders available on the entity.
         */
        orders(request: AvonRequest): Ordering[];
    };
} & Tbase;
export default _default;
//# sourceMappingURL=ResolvesOrderings.d.ts.map
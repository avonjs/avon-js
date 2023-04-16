import { type AvonRequest } from '../Http/Requests';
import Ordering from '../Orderings/Ordering';
import { type AbstractMixable, type Mixable } from './Mixable';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default <Tbase extends Mixable | AbstractMixable = Mixable>(
  Parent: Tbase,
) => {
  return class ResolvesOrderings extends Parent {
    /**
     * Get the orders that are available for the given request.
     */
    public availableOrderings(request: AvonRequest): Ordering[] {
      return this.resolveOrderings(request)
        .concat(this.resolveOrderingsFromFields(request))
        .filter((order) => order.authorizedToSee(request));
    }

    /**
     * Get the orders for the given request.
     */
    public resolveOrderings(request: AvonRequest): Ordering[] {
      return this.orders(request);
    }

    /**
     * Get the orders from orderable fields for the given request.
     */
    public resolveOrderingsFromFields(request: AvonRequest): Ordering[] {
      return request
        .resource()
        .orderableFields(request)
        .map((field) => field.resolveOrdering(request))
        .filter((order) => order instanceof Ordering)
        .unique((order: Ordering) => order.key())
        .all() as Ordering[];
    }

    /**
     * Get the orders available on the entity.
     */
    public orders(request: AvonRequest): Ordering[] {
      return [];
    }
  };
};

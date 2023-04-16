import type Action from '../Actions/Action';
import { type AvonRequest } from '../Http/Requests';
import { type AbstractMixable, type Mixable } from './Mixable';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default <Tbase extends Mixable | AbstractMixable = Mixable>(
  Parent: Tbase,
) => {
  return class ResolvesFilters extends Parent {
    /**
     * Get the actions that are available for the given request.
     */
    public availableActions(request: AvonRequest): Action[] {
      return this.resolveActions(request).filter((action) =>
        action.authorizedToSee(request),
      );
    }

    /**
     * Get the actions for the given request.
     */
    public resolveActions(request: AvonRequest): Action[] {
      return this.actions(request);
    }

    /**
     * Get the actions available on the entity.
     */
    public actions(request: AvonRequest): Action[] {
      return [
        //
      ];
    }
  };
};

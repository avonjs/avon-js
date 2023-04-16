import { type AvonRequest } from '../Http/Requests';
import { type AbstractMixable, type Mixable } from './Mixable';

export type SeeCallback = (request: AvonRequest) => boolean;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default <Tbase extends Mixable | AbstractMixable = Mixable>(
  Parent: Tbase,
) => {
  return class AuthorizedToSee extends Parent {
    /**
     * The callback used to authorize viewing the filter or action.
     */
    public seeCallback: SeeCallback = () => true;

    /**
     * Determine if the filter or action should be available for the given request.
     */
    public authorizedToSee(request: AvonRequest): boolean {
      return this.seeCallback(request);
    }

    /**
     * Set the callback to be run to authorize viewing the filter or action.
     */
    public canSee(callback: SeeCallback): this {
      this.seeCallback = callback;

      return this;
    }
  };
};

import { type AvonRequest } from '../Http/Requests';
import { type Model } from '../Models';
import { type Mixable, type AbstractMixable } from './Mixable';

export type PrunCallback = (
  request: AvonRequest,
  resource: Model,
  attribute: string,
) => any;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default <Tbase extends Mixable | AbstractMixable = Mixable>(
  Parent: Tbase,
) => {
  abstract class Prunable extends Parent {
    [x: string]: any;

    /**
     * The callback used to prunable the field.
     */
    public prunUsingCallback: PrunCallback = this.prunCallback;

    /**
     * Indicates if the underlying field is prunable.
     */
    public prunable = true;

    /**
     * Specify the callback that should be used to prunable the field.
     */
    public prunUsing(prunUsingCallback: PrunCallback): this {
      this.prunUsingCallback = prunUsingCallback;

      return this;
    }

    /**
     * Determine if the underlying file should be pruned when the resource is deleted.
     */
    public isPrunable(): boolean {
      return this.prunable;
    }

    /**
     * Specify if the underlying field should be pruned when the resource is deleted.
     */
    public withPruning(prunable = true): this {
      this.prunable = prunable;

      return this;
    }

    /**
     * Handle pruning for the incoming requests.
     */
    public async forRequest(request: AvonRequest): Promise<PrunCallback> {
      return this.prunUsingCallback(
        request,
        await request.findModelOrFail(),
        this.attribute,
      );
    }

    /**
     * Specify the default callback that should be used to prunable the field.
     */
    public abstract prunCallback(): PrunCallback;
  }

  return Prunable;
};

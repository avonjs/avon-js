import type Ordering from '../Orderings/Ordering';
import { type AvonRequest } from '../Http/Requests';
import type Repository from '../Repositories/Repository';
import { Operator } from '../Repositories/Repository';
import { type AbstractMixable, type Mixable } from './Mixable';
import { type Model } from '../Models';

export type OrderingCallback = (
  request: AvonRequest,
  repository: Repository<Model>,
  value: any,
) => any;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default <Tbase extends Mixable | AbstractMixable = Mixable>(
  Parent: Tbase,
) => {
  abstract class Orderable extends Parent {
    /**
     * The callback to be used for the field's default value.
     */
    public orderableCallback?: OrderingCallback;

    /**
     * Apply the order to the given query.
     */
    public applyOrdering(
      request: AvonRequest,
      repository: Repository<Model>,
      value: any,
    ): any {
      // eslint-disable-next-line no-useless-call
      this.orderableCallback?.apply(this, [request, repository, value]);
    }

    /**
     * Make the field order.
     */
    public resolveOrdering(request: AvonRequest): Ordering | undefined {
      // prevent resolving fields that do not use for ordering
      if (this.orderableCallback != null) {
        return this.makeOrdering(request);
      }
    }

    /**
     * The callback used to determine if the field is orderable.
     */
    public orderable(callback?: OrderingCallback): this {
      this.orderableCallback = callback ?? this.defaultOrderingCallback();

      return this;
    }

    /**
     * Define the default orderable callback.
     */
    public defaultOrderingCallback(): OrderingCallback {
      return (
        request: AvonRequest,
        repository: Repository<Model>,
        value: any,
      ) => {
        repository.where({
          key: this.orderableAttribute(request),
          operator: Operator.eq,
          value,
        });
      };
    }

    /**
     * Make the field order.
     */
    public abstract makeOrdering(request: AvonRequest): Ordering;

    /**
     * Define orderable attribute.
     */
    public abstract orderableAttribute(request: AvonRequest): string;
  }

  return Orderable;
};

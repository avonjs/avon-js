import type Filter from '../Filters/Filter';
import { type AvonRequest } from '../Http/Requests';
import { type Model } from '../Models';
import { Operator, type Repository } from '../Repositories';
import { type AbstractMixable, type Mixable } from './Mixable';

export type FilterableCallback = (
  request: AvonRequest,
  repository: Repository<Model>,
  value: any,
) => void;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default <Tbase extends Mixable | AbstractMixable = Mixable>(
  Parent: Tbase,
) => {
  abstract class Filterable extends Parent {
    /**
     * The callback to be used for the field's default value.
     */
    public filterableCallback?: FilterableCallback;

    /**
     * Apply the filter to the given query.
     */
    public async applyFilter(
      request: AvonRequest,
      repository: Repository<Model>,
      value: any,
    ): Promise<any> {
      // eslint-disable-next-line @typescript-eslint/await-thenable, no-useless-call
      await this.filterableCallback?.apply(this, [request, repository, value]);
    }

    /**
     * Make the field filter.
     */
    public resolveFilter(request: AvonRequest): Filter | undefined {
      // prevent resolving fields that do not use for filtering
      if (this.filterableCallback != null) {
        return this.makeFilter(request);
      }
    }

    /**
     * The callback used to determine if the field is filterable.
     */
    public filterable(callback?: FilterableCallback): this {
      this.filterableCallback = callback ?? this.defaultFilterableCallback();

      return this;
    }

    /**
     * Define the default filterable callback.
     */
    public defaultFilterableCallback(): FilterableCallback {
      return (
        request: AvonRequest,
        repository: Repository<Model>,
        value: any,
      ) => {
        repository.where({
          key: this.filterableAttribute(request),
          operator: Operator.eq,
          value,
        });
      };
    }

    /**
     * Make the field filter.
     */
    public abstract makeFilter(request: AvonRequest): Filter;

    /**
     * Define filterable attribute.
     */
    public abstract filterableAttribute(request: AvonRequest): string;
  }

  return Filterable;
};

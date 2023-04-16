import { type AvonRequest } from '../../Http/Requests';
import Filter from './Filter';
import { type Model } from '../../Models';
import type Repository from '../../Repositories/Repository';
import { type Validator } from '../../Mixins/Nullable';
import collect from 'collect.js';

export default class RelatableFilter extends Filter {
  /**
   * Values which will be replaced to null.
   */
  public nullValidator: Validator = (value: any) => {
    return collect<number | string>(value)
      .filter((value) => value !== undefined && String(value).length > 0)
      .isEmpty();
  };

  /**
   * Apply the filter into the given repository.
   */
  public async apply(
    request: AvonRequest,
    repository: Repository<Model>,
    value: any,
  ): Promise<any> {
    return await super.apply(request, repository, collect(value).all());
  }

  /**
   * Get the query parameter key for filter.
   */
  public key(): string {
    return this.field.constructor.name + ':' + this.field.attribute;
  }
}

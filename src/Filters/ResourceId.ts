import { type AvonRequest } from '../Http/Requests';
import type Repository from '../Repositories/Repository';
import Filter from './Filter';

export default class PrimaryKey extends Filter {
  constructor(...args: readonly []) {
    super(...args);
    this.nullable();
  }

  /**
   * Apply the filter into the given repository.
   */
  public apply(request: AvonRequest, repository: Repository, value: any): any {
    repository.whereKey(value);
  }
}

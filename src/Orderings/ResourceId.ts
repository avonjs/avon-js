import { type AvonRequest } from '../Http/Requests';
import { Direction, type Repository } from '../Repositories';
import Ordering from './Ordering';

export default class PrimaryKey extends Ordering {
  /**
   * Apply the filter into the given repository.
   */
  public apply(request: AvonRequest, repository: Repository, value: any): any {
    repository.order({
      key: request.model().getKeyName(),
      direction: Direction.ASC === value ? value : Direction.DESC,
    });
  }
}

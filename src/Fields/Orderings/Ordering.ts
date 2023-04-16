import Ordering from '../../Orderings/Ordering';
import { type Model } from '../../Models';
import type Repository from '../../Repositories/Repository';
import type Field from '../Field';
import { type AvonRequest } from '../../Http/Requests';

export default class extends Ordering {
  /**
   * Indicates if the field is nullable.
   */
  public acceptsNullValues = true;

  constructor(protected field: Field) {
    super();
  }

  /**
   * Apply the ordering into the given repository.
   */
  public async apply(
    request: AvonRequest,
    repository: Repository<Model>,
    value: any,
  ): Promise<any> {
    if (this.isValidNullValue(value)) {
      return;
    }

    this.field.applyOrdering(request, repository, value);
  }

  /**
   * Get the query parameter key for ordering.
   */
  public key(): string {
    return this.field.constructor.name + ':' + this.field.attribute;
  }
}

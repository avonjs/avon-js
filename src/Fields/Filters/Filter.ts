import Filter from '../../Filters/Filter';
import { type AvonRequest } from '../../Http/Requests';
import { type Model } from '../../Models';
import type Repository from '../../Repositories/Repository';
import type Field from '../Field';

export default abstract class extends Filter {
  /**
   * Indicates if the field is nullable.
   */
  public acceptsNullValues = true;

  constructor(protected field: Field) {
    super();
  }

  /**
   * Apply the filter into the given repository.
   */
  public async apply(
    request: AvonRequest,
    repository: Repository<Model>,
    value: any,
  ): Promise<any> {
    if (this.isValidNullValue(value)) {
      return;
    }

    await this.field.applyFilter(request, repository, value);
  }

  /**
   * Get the query parameter key for filter.
   */
  public key(): string {
    return this.field.constructor.name + ':' + this.field.attribute;
  }
}

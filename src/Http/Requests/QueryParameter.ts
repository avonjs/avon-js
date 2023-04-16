import Nullable from '../../Mixins/Nullable';

export default abstract class QueryParameter extends Nullable(class {}) {
  /**
   * Get the query parameter key name.
   */
  abstract key(): string;
}

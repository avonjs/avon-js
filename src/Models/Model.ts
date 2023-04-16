export default abstract class Model {
  /**
   * Set value for the given key.
   */
  abstract setAttribute(key: string, value: any): Model;

  /**
   * Get value for the given key.
   */
  abstract getAttribute(key: string): any;

  /**
   * Get the model key.
   */
  abstract getKey(): any;

  /**
   * Get primary key name of the model.
   */
  abstract getKeyName(): string;

  /**
   * Get all of the model attributes.
   */
  abstract all(): Record<string, any>;
}

import type { Request } from 'express';
import Collection from '../../Collections/Collection';

export default abstract class FormRequest {
  constructor(protected request: Request) {}

  /**
   * Get params from route for the given key.
   */
  public route(key: string, callback?: any): string | undefined {
    return this.request.params[key] ?? callback;
  }

  /**
   * Get collection of request attributes.
   */
  public collect(): Collection<Record<string, any>> {
    return new Collection(this.request.query ?? {}).merge(
      this.request.body ?? {},
    );
  }

  /**
   * Get value from request.
   */
  public get(key: string, callback?: any): any {
    return this.collect().get(key, callback);
  }

  /**
   * Get all attributes from request body and query.
   */
  public all(keys: string[] = []): Record<string, any> {
    return keys.length > 0 ? this.only(keys) : this.collect().all();
  }

  /**
   * Get only given keys from request body and query.
   */
  public only(keys: string[] = []): Record<string, any> {
    return this.collect().only(keys).all();
  }

  /**
   * Get value from request body.
   */
  public input(key: string, callback?: any): any {
    return new Collection(this.request?.body).get(key, callback);
  }

  /**
   * Get value from query strings.
   */
  public query(key: string, callback?: any): any {
    return new Collection(this.request?.query).get(key, callback);
  }

  /**
   * Get value from request body and query as string.
   */
  public string(key: string, callback?: string): string {
    return String(this.get(key, callback));
  }

  /**
   * Get value from request body and query as string.
   */
  public number(key: string, callback?: number): number {
    return Number(this.get(key, callback));
  }

  /**
   * Get value from request body and query as array.
   */
  public array(key: string, callback?: number): any[] {
    const value = this.get(key, callback);

    return Array.isArray(value) ? value : [value];
  }

  /**
   * Check if given key exists in request body or query parameters and has valid value.
   */
  filled(keys: string | string[]): boolean {
    if (!this.exists(keys)) {
      return false;
    }

    const filled = this.only(Array.isArray(keys) ? keys : [keys]).filter(
      (value: any) => ![null, undefined, '', [], {}].includes(value),
    );

    return filled.length > 0;
  }

  /**
   * Check if given key exists in request body or query parameters.
   */
  public exists(keys: string | string[]): boolean {
    return this.collect().has<string | string[]>(keys);
  }

  /**
   * Get the real request instance.
   */
  public getRequest(): Request {
    return this.request;
  }
}

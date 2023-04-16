import { type AvonRequest } from '../Requests';
import type Response from '../Responses/Response';

export default class Controller {
  /**
   * Default route handler
   */
  public async __invoke(request: AvonRequest): Promise<Response> {
    throw new Error(`Inovked controller ${this.constructor.name}`);
  }
}

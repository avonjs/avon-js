import Avon from '../../Avon';
import Controller from './Controller';
import type Response from '../Responses/Response';
import type SchemaRequest from '../Requests/SchemaRequest';
import SchemaResponse from '../Responses/SchemaResponse';

export default class SchemaController extends Controller {
  /**
   * Default route handler
   */
  public async __invoke(request: SchemaRequest): Promise<Response> {
    return new SchemaResponse(Avon.schema(request));
  }
}

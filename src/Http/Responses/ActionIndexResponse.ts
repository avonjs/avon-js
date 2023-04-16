import { type SerilizedAction } from '../../Actions/Action';
import Response from './Response';

export default class ActionIndexResponse extends Response {
  constructor(data: SerilizedAction[], meta: Record<string, any> = {}) {
    super(200, data, meta);
  }
}

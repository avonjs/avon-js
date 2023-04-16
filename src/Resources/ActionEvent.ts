import type Repository from '../Repositories/Repository';
import ActionEventRepository from '../Repositories/ActionEvent';
import type Field from '../Fields/Field';
import Text from '../Fields/Text';
import { type AvonRequest } from '../Http/Requests';
import Resource from '../Resource'; 

export default class ActionEvent extends Resource {
  /**
   * Get the fields available on the entity.
   */
  public fields(request: AvonRequest): Field[] {
    return [
      new Text('id').filterable().orderable().exceptOnForms(),
      new Text('model_type').filterable().orderable(),
      new Text('model_id').filterable().orderable(), 
      new Text('resource_name').filterable().orderable(),
      new Text('resource_id').filterable().orderable(),
      new Text('payload').resolveUsing((value) => JSON.stringify(value)),
      new Text('changes').resolveUsing((value) => JSON.stringify(value)),
      new Text('original').resolveUsing((value) => JSON.stringify(value)), 
    ];
  }

  /**
   * Get the repository.
   */
  public repository(): Repository {
    return new (class extends ActionEventRepository {})();
  }
}

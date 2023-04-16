import Response from './Response';

export default class SuccessfulResponse extends Response {
  constructor(
    message: string = 'Your action successfully ran.',
    meta: Record<string, any> = {},
  ) {
    super(200, { message }, meta);
  }
}

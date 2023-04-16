import type { Request, Response } from 'express';
export default class Dispatcher {
    /**
     * Disptach incoming request to correspond controller.
     */
    static dispatch(handler: string): (request: Request, response: Response) => void;
}
//# sourceMappingURL=Dispatcher.d.ts.map
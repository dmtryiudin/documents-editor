export class ResponseError extends Error {
  status: number;
  context?: Array<any>;

  constructor(message: string, status: number, context?: Array<any>) {
    super(message);
    this.status = status;
    this.context = context;
  }

  static badRequest(message: string, context?: Array<any>) {
    return new ResponseError(message, 400, context);
  }

  static internalServerError(context?: Array<any>) {
    return new ResponseError(
      "Виникла невідома помилка. Повторіть дію пізніше.",
      500,
      context
    );
  }

  static unauthorized(message: string, context?: Array<any>) {
    return new ResponseError(message, 401, context);
  }

  static notFound(message: string, context?: Array<any>) {
    return new ResponseError(message, 404, context);
  }
}

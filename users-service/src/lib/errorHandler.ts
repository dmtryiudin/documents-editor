import { ResponseError } from "./responseError";
import { response } from "./response";

export const errorHandler = (error: any) => {
  console.log(error);
  if (error instanceof ResponseError) {
    return response({
      ok: false,
      status: error.status,
      data: null,
      error: {
        message: error.message,
        context: error.context,
      },
    });
  } else {
    const unknownError = ResponseError.internalServerError();

    return response({
      ok: false,
      status: unknownError.status,
      data: null,
      error: {
        message: unknownError.message,
        context: unknownError.context,
      },
    });
  }
};

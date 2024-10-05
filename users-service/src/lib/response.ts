import { ResponseType } from "../types/ResponseType";

export const response = (data: ResponseType) => {
  return JSON.stringify(data);
};

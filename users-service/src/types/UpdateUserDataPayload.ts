import { UpdateUserDataDto } from "../dto/UpdateUserDataDto";

export type UpdateUserDataPayload = {
  token: string;
  payload: UpdateUserDataDto;
};

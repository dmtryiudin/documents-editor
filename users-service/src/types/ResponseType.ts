export type ResponseType = {
  ok: boolean;
  status: number;
  data: any | null;
  error: {
    message: string;
    context?: Array<any>;
  } | null;
};

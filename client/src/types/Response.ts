export type Response<Data> = {
  ok: boolean;
  status: number;
  data: Data | null;
  error: {
    message: string;
    context?: Array<any>;
  } | null;
};

export type ErrorType = {
  code: string;
  message?: string;
  data?: any;
};
export default class IError extends Error {
  codes: ErrorType[];
  constructor(
    codes: (ErrorType | undefined | null)[],
    ...params: Parameters<typeof Error>
  ) {
    super(...params);
    this.codes = [...(codes.filter((code) => !!code) as ErrorType[])];
  }
}

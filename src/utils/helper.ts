export const createResponse = (message: string, data: unknown) => ({
  message: message,
  data: data,
});

export class ErrorWStatus extends Error {
  status: number;

  constructor() {
    super();
    this.status = 0;
  }
}

export const createError = (status: number, name: string, message: string) => {
  const e = new ErrorWStatus();
  e.status = status;
  e.name = name;
  e.message = message;
  return e;
};

// Help TypeScript narrow down type
// Source: https://fettblog.eu/typescript-hasownproperty/
export const hasOwnProperty = <X extends {}, Y extends PropertyKey>(
  obj: X,
  prop: Y
): obj is X & Record<Y, unknown> => {
  return Object.prototype.hasOwnProperty.call(obj, prop);
};

export const createResponse = (message: string, data: unknown) => ({
  message: message,
  data: data,
});

export const createError = (_: number, name: string, message: string) => {
  const e = new Error();
  //e.status = status; <- Seemed useless. TODO: check
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

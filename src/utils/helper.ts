export const createResponse = (message: string, data: any) => ({
  message: message,
  data: data,
});

export const createError = (status: number, name: string, message: string) => {
  const e = new Error();
  (<any>e).status = status;
  e.name = name;
  e.message = message;
  return e;
};

// Help TypeScript narrow down type
// Source: https://fettblog.eu/typescript-hasownproperty/
export const hasOwnProperty = <X extends {}, Y extends PropertyKey>
  (obj: X, prop: Y): obj is X & Record<Y, unknown> => {
  return obj.hasOwnProperty(prop)
}
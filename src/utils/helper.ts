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

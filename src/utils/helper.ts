export const createResponse = (message: string, data: any) => ({
    "message": message,
    "data": data
});

export const createError = (status: number ,name: string, message: string) => {
    let e = new Error();
    e.status = status;
    e.name = name;
    e.message = message;
    return e;
};
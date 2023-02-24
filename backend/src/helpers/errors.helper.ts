export type ErrorType = {
  name: string;
  message: string;
};

function notFoundError(message: string = ""): ErrorType {
  return {
    name: "NotFound",
    message,
  };
}

function badRequestError(message: string = ""): ErrorType {
  return {
    name: "BadRequest",
    message,
  };
}

function forbiddenError(message: string = ""): ErrorType {
  return {
    name: "Forbidden",
    message,
  };
}

function unauthorizedError(message: string = ""): ErrorType {
  return {
    name: "Unauthorized",
    message,
  };
}

function conflictError(message: string = ""): ErrorType {
  return {
    name: "Conflict",
    message,
  };
}

function signUpError(message: string = ""): ErrorType {
  return {
    name: "SignUp",
    message,
  };
}

export { notFoundError, badRequestError, forbiddenError, unauthorizedError, conflictError, signUpError };

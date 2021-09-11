const AuthenticationRequired = {
  error: true,
  statusCode: 401,
  message: 'Authentication Required',
};

const AuthenticationNotCompleted = {
  error: true,
  statusCode: 403,
  message: 'Authentication Not Completed',
};
export { AuthenticationRequired, AuthenticationNotCompleted };

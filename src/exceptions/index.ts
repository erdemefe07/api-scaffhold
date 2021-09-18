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

const EmailVerifyRequired = {
  error: true,
  statusCode: 403,
  message: 'Email Verify Required',
};
export { AuthenticationRequired, AuthenticationNotCompleted, EmailVerifyRequired };

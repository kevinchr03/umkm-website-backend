const formatResponse = (status, message, data = null) => {
  const response = {
    status,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  return response;
};

const successResponse = (message, data = null) => {
  return formatResponse("success", message, data);
};

const errorResponse = (message, errors = null) => {
  return formatResponse("error", message, errors);
};

module.exports = {
  formatResponse,
  successResponse,
  errorResponse,
};

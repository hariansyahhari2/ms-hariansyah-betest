const ok = (data) => {
  return {
    code: 200,
    message: "OK",
    data: data
  }
};

const badRequest = (data) => {
  return {
    code: 400,
    message: "Bad Request",
    details: data,
    data: null
  }
}

const error = (code, status, details = null) => {
  return  {
    code: code,
    status: status,
    details: details,
    data: null
  }
}

module.exports = {
  ok,
  badRequest,
  error
}

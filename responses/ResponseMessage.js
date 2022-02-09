exports.ok = (data) => {
    return {
        code: 200,
        message: "OK",
        data: data
    }
}

exports.auth = (token) => {
    return {
        code: 200,
        message: "OK",
        data: {
            token: token
        }
    }
}

exports.error = (code, status) => {
    return  {
        code: code,
        status: status,
        data: null
    }
}

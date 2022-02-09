exports.hideSensitiveData = (data) => {
    return {
        _id: data._id,
        userName: data.userName,
        emailAddress: data.emailAddress,
        accountNumber: data.accountNumber,
        identityNumber: data.identityNumber
    }
}

exports.hideSensitiveDataList = (dataList) => {
    const output = []
    dataList.forEach((data) => {
        output.push({
            _id: data._id,
            userName: data.userName,
            emailAddress: data.emailAddress,
            accountNumber: data.accountNumber,
            identityNumber: data.identityNumber
        })
    })
    return output;
}

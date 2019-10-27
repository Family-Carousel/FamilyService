module.exports = function () {

    const buildResponse = (statusCode, body) => {
        return {
            isBase64Encoded: false,
            statusCode: statusCode,
            headers: { 'Access-Control-Allow-Origin': '*'},
            body: JSON.stringify(body)
        }
    }

    const parseErrorMessage = (err) => {
        return err.message || err;
    }

    return {
        buildResponse: buildResponse,
        parseErrorMessage: parseErrorMessage
    }
}();
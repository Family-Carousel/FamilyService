import { ProxyResult } from 'aws-lambda';

module.exports = function () {

    const buildResponse = (statusCode: number, body: string): ProxyResult => {
        return {
            isBase64Encoded: false,
            statusCode: statusCode,
            headers: { 'Access-Control-Allow-Origin': '*'},
            body: body
        }
    }

    return {
        buildResponse: buildResponse,
    }
}();

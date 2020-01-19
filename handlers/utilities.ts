import { ProxyResult } from 'aws-lambda';

class Utilities {

    public BuildResponse(statusCode: number, body: string): ProxyResult {
        return {
            isBase64Encoded: false,
            statusCode: statusCode,
            headers: { 'Access-Control-Allow-Origin': '*'},
            body: body
        }
    }
}

export const utilities = new Utilities();

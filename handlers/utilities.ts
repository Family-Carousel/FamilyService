import { ProxyResult } from 'aws-lambda';

export class Utilities {

    public static BuildResponse(statusCode: number, body: string): ProxyResult {
        return {
            isBase64Encoded: false,
            statusCode: statusCode,
            headers: { 'Access-Control-Allow-Origin': '*'},
            body: body
        }
    }
}

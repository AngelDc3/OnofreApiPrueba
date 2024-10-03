export interface Error {
    statusCode: number;
    status: string;
    message: string;
    stack?: string;
    operational: boolean;

}
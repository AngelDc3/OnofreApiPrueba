export interface Error {
    name: string;
    statusCode: number;
    status: string;
    message: string;
    stackTrace?: string;
    operational: boolean;

}
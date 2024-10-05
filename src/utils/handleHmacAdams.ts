import crypto from 'crypto';

const ADAMS_SECRET = process.env.ADAMS_SECRET

export function calcularHmac(post: string) {
    return crypto.createHash('md5').update('adams' + post + ADAMS_SECRET).digest('hex');
}
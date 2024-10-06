import { createHash } from 'node:crypto';

const ADAMS_SECRET = process.env.ADAMS_SECRET

export function calcularHmac(post: string) {
    return createHash('md5').update('adams' + post + ADAMS_SECRET).digest('hex');
}
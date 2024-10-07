import { createHash } from 'node:crypto';

const ADAMS_SECRET = process.env.ADAMS_SECRET

export function calcularHmac(post: object) {
    const postData = JSON.stringify(post);

    return createHash('md5').update('adams' + postData + ADAMS_SECRET).digest('hex');
}
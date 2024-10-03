import { Auth } from "./auth.interface";

export interface User extends Auth {
    userId: string;
    userName: string;
    nombres: string;
    apellidos: string;
}
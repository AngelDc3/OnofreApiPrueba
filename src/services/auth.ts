

import { Auth } from "../interfaces/auth.interface";
import { User } from "../interfaces/user.interface";
import { encrypt, verified } from "../utils/bcrypt.handle";
import { generateToken } from "../utils/jwt.handle";

//config pool
import { Pool } from "pg"
import config from "../config/pg";


const pool = new Pool(config)

const registerNewUser = async ({ email, password, userName }: User) => {
    const checkIs = await pool.query("SELECT * FROM users WHERE correo = $1", [email]);
    if (checkIs.rowCount) return "ALREADY_USER";
    const passHash = await encrypt(password);
    const registerNewUser = await pool.query(`
        INSERT INTO users (correo, password, userName)
        VALUES ($1, $2, $3)
        `, [email, passHash, userName]);

    return registerNewUser;
};

const loginUser = async ({ email, password }: Auth) => {

    const checkIs = await pool.query("SELECT * FROM users WHERE correo = $1", [email]);
    if (!checkIs) return "NOT_FOUND_USER";

    const passwordHash = checkIs.rows[0].password;
    const isCorrect = await verified(password, passwordHash);

    if (!isCorrect) return "PASSWORD_INCORRECT";

    const token = generateToken(checkIs.rows[0].userid);
    const data = {
        token,
        //quitar el password con destructuring
        user: { ...checkIs.rows[0], password: undefined }
    };
    return data;
};

export { registerNewUser, loginUser };
import { loginCtrl, registerCtrl } from "../controllers/auth";

import { Router } from "express";
import { loginValidation, registerValidation } from "../validators/auth";

const router = Router();


router.post("/register", registerValidation, registerCtrl);
router.post("/login", loginValidation, loginCtrl);

export { router };
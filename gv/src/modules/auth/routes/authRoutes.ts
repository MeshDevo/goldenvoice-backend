import { Router } from "express";
import { validateRequestBody } from "../../../shared/middleware/validateRequestBody";
import { registerUserSchema } from "../dto/registerUserDto";
import { loginUserSchema } from "../dto/loginUserDto";
import { handleUserRegistration, handleUserLogin } from "../controllers/authController";

export const authRoutes = Router();

authRoutes.post("/register", validateRequestBody(registerUserSchema), handleUserRegistration);
authRoutes.post("/login", validateRequestBody(loginUserSchema), handleUserLogin);

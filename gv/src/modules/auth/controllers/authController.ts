import { Request, Response } from "express";
import { asyncHandler } from "../../../shared/utils/asyncHandler";
import { registerNewUser, loginWithCredentials } from "../services/authService";
import { RegisterUserDto } from "../dto/registerUserDto";
import { LoginUserDto } from "../dto/loginUserDto";

// Controllers only translate HTTP <-> service calls. They contain no
// business logic themselves (Trous principle 45: separate business
// logic from presentation).
export const handleUserRegistration = asyncHandler(
  async (request: Request, response: Response) => {
    const registrationResult = await registerNewUser(request.body as RegisterUserDto);
    response.status(201).json(registrationResult);
  }
);

export const handleUserLogin = asyncHandler(
  async (request: Request, response: Response) => {
    const loginResult = await loginWithCredentials(request.body as LoginUserDto);
    response.status(200).json(loginResult);
  }
);

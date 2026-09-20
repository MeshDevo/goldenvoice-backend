import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRole } from "@prisma/client";
import { prismaClient } from "../../../database/prismaClient";
import { conflictError, unauthorizedError } from "../../../shared/errors/AppError";
import { getJwtExpiresIn, getJwtSecret } from "../../../shared/config/environment";
import { RegisterUserDto } from "../dto/registerUserDto";
import { LoginUserDto } from "../dto/loginUserDto";

// Number of bcrypt salt rounds. Named constant instead of a bare "10"
// so its meaning is obvious at the call site (Trous principle 41).
const PASSWORD_HASH_SALT_ROUNDS = 10;

interface AuthenticationResult {
  accessToken: string;
  user: {
    id: string;
    email: string;
    displayName: string;
    role: UserRole;
  };
}

function issueAccessTokenForUser(user: { id: string; email: string; role: UserRole }): string {
  return jwt.sign(
    { userId: user.id },
    getJwtSecret(),
    { expiresIn: getJwtExpiresIn() }
  );
}

// Creates a new user account. Throws a conflict error if the email is
// already registered, so the controller does not need to know about
// database-level constraints.
export async function registerNewUser(
  registrationData: RegisterUserDto
): Promise<AuthenticationResult> {
  const existingUserWithEmail = await prismaClient.user.findUnique({
    where: { email: registrationData.email },
  });

  if (existingUserWithEmail) {
    throw conflictError("An account with this email address already exists.");
  }

  const passwordHash = await bcrypt.hash(registrationData.password, PASSWORD_HASH_SALT_ROUNDS);

  const createdUser = await prismaClient.user.create({
    data: {
      email: registrationData.email,
      passwordHash,
      displayName: registrationData.displayName,
      role: UserRole.MEMBER,
    },
  });

  return {
    accessToken: issueAccessTokenForUser(createdUser),
    user: {
      id: createdUser.id,
      email: createdUser.email,
      displayName: createdUser.displayName,
      role: createdUser.role,
    },
  };
}

// Verifies credentials and issues an access token. Uses a generic
// "invalid credentials" message for both "unknown email" and "wrong
// password" so the API never reveals which emails are registered.
export async function loginWithCredentials(
  loginData: LoginUserDto
): Promise<AuthenticationResult> {
  const existingUser = await prismaClient.user.findUnique({
    where: { email: loginData.email },
  });

  if (!existingUser) {
    throw unauthorizedError("Invalid email or password.");
  }

  const isPasswordCorrect = await bcrypt.compare(loginData.password, existingUser.passwordHash);

  if (!isPasswordCorrect) {
    throw unauthorizedError("Invalid email or password.");
  }

  return {
    accessToken: issueAccessTokenForUser(existingUser),
    user: {
      id: existingUser.id,
      email: existingUser.email,
      displayName: existingUser.displayName,
      role: existingUser.role,
    },
  };
}

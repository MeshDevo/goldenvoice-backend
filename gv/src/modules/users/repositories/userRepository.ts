import { prismaClient } from "../../../database/prismaClient";

// Fields that are safe to return to clients. The password hash must
// never leave this layer.
const PUBLIC_USER_FIELDS = {
  id: true,
  email: true,
  displayName: true,
  role: true,
  createdAt: true,
} as const;

export function findUserById(userId: string) {
  return prismaClient.user.findUnique({
    where: { id: userId },
    select: PUBLIC_USER_FIELDS,
  });
}

export function updateUserDisplayName(userId: string, displayName: string) {
  return prismaClient.user.update({
    where: { id: userId },
    data: { displayName },
    select: PUBLIC_USER_FIELDS,
  });
}

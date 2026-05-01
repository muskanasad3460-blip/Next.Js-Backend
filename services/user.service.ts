import { prisma } from "../utils/prisma";

export class UserService {
  getUserById(id: string) {
    return prisma.admin.findFirst({
      where: { id },
    });
  }
}

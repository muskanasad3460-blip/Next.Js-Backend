"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const prisma_1 = require("../utils/prisma");
class UserService {
    getUserById(id) {
        return prisma_1.prisma.admin.findFirst({
            where: { id },
        });
    }
}
exports.UserService = UserService;

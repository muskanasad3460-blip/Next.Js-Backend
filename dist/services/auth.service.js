"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const prisma_1 = require("../utils/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ApiError_1 = require("../utils/ApiError");
class AuthService {
    // ======================
    // USER REGISTER
    // ======================
    async registerUser(name, email, password) {
        const exists = await prisma_1.prisma.user.findUnique({
            where: { email },
        });
        if (exists) {
            throw new ApiError_1.ApiError(400, "User already exists");
        }
        const hash = await bcryptjs_1.default.hash(password, 10);
        const user = await prisma_1.prisma.user.create({
            data: {
                name,
                email,
                password: hash,
            },
        });
        return {
            id: user.id,
            name: user.name,
            email: user.email,
        };
    }
    // ======================
    // USER LOGIN
    // ======================
    async loginUser(email, password) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new ApiError_1.ApiError(400, "User not found");
        }
        const match = await bcryptjs_1.default.compare(password, user.password);
        if (!match) {
            throw new ApiError_1.ApiError(400, "Invalid credentials");
        }
        if (!process.env.JWT_SECRET) {
            throw new ApiError_1.ApiError(500, "JWT_SECRET not defined");
        }
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
            email: user.email,
            type: "user",
        }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            token,
        };
    }
    // ======================
    // ADMIN REGISTER
    // ======================
    async registerAdmin(name, email, password) {
        const exists = await prisma_1.prisma.admin.findUnique({
            where: { email },
        });
        if (exists) {
            throw new ApiError_1.ApiError(400, "Admin already exists");
        }
        const hash = await bcryptjs_1.default.hash(password, 10);
        return prisma_1.prisma.admin.create({
            data: {
                name,
                email,
                password: hash,
            },
        });
    }
    // ======================
    // ADMIN LOGIN
    // ======================
    async loginAdmin(email, password) {
        const admin = await prisma_1.prisma.admin.findUnique({
            where: { email },
        });
        if (!admin) {
            throw new ApiError_1.ApiError(400, "Only admin can login");
        }
        const match = await bcryptjs_1.default.compare(password, admin.password);
        if (!match) {
            throw new ApiError_1.ApiError(400, "Invalid credentials");
        }
        if (!process.env.JWT_SECRET) {
            throw new ApiError_1.ApiError(500, "JWT_SECRET not defined");
        }
        const token = jsonwebtoken_1.default.sign({
            id: admin.id,
            email: admin.email,
            type: "admin",
        }, process.env.JWT_SECRET, { expiresIn: "1d" });
        return {
            admin: {
                id: admin.id,
                email: admin.email,
            },
            token,
        };
    }
    // ======================
    // UPDATE PROFILE
    // ======================
    async updateProfile(userId, data) {
        return prisma_1.prisma.user.update({
            where: { id: userId },
            data,
        });
    }
}
exports.AuthService = AuthService;

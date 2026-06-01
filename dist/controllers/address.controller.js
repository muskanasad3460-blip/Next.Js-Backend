"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsertAddress = exports.getAddress = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const prisma_1 = require("../utils/prisma");
// GET USER ADDRESS
exports.getAddress = (0, express_async_handler_1.default)(async (req, res) => {
    const userId = req.user.id;
    const address = await prisma_1.prisma.address.findFirst({
        where: { userId },
    });
    res.json({ success: true, address });
});
// CREATE OR UPDATE ADDRESS (1 per user)
exports.upsertAddress = (0, express_async_handler_1.default)(async (req, res) => {
    const userId = req.user.id;
    const { country, city, postalCode, taxId } = req.body;
    const address = await prisma_1.prisma.address.upsert({
        where: {
            userId, // need unique index (see below)
        },
        update: {
            country,
            city,
            postalCode,
            taxId,
        },
        create: {
            userId,
            country,
            city,
            postalCode,
            taxId,
        },
    });
    res.json({
        success: true,
        address,
    });
});

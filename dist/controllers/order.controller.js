"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.cancelOrder = exports.deleteOrder = exports.getSingleOrder = exports.getOrders = exports.createOrder = void 0;
const prisma_1 = require("../utils/prisma");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
// =========================
// CREATE ORDER
// =========================
const createOrder = async (req, res) => {
    try {
        const { customer, paymentMethod, products, subtotal } = req.body;
        if (!customer?.firstName?.trim()) {
            return res.status(400).json({
                success: false,
                message: "First name is required",
            });
        }
        if (!products || products.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No products found",
            });
        }
        const order = await prisma_1.prisma.order.create({
            data: {
                firstName: customer.firstName,
                companyName: customer.companyName,
                streetAddress: customer.streetAddress,
                apartment: customer.apartment,
                city: customer.city,
                phone: customer.phone,
                email: customer.email,
                paymentMethod,
                subtotal,
                products,
            },
        });
        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.createOrder = createOrder;
// =========================
// GET ALL ORDERS
// =========================
const getOrders = async (req, res) => {
    try {
        const orders = await prisma_1.prisma.order.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        res.status(200).json({
            success: true,
            orders,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.getOrders = getOrders;
// =========================
// GET SINGLE ORDER
// =========================
const getSingleOrder = async (req, res) => {
    try {
        const id = req.params.id;
        const order = await prisma_1.prisma.order.findUnique({
            where: {
                id,
            },
        });
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }
        res.status(200).json({
            success: true,
            order,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.getSingleOrder = getSingleOrder;
// =========================
// DELETE ORDER
// =========================
const deleteOrder = async (req, res) => {
    try {
        const id = req.params.id;
        const existingOrder = await prisma_1.prisma.order.findUnique({
            where: { id },
        });
        if (!existingOrder) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }
        await prisma_1.prisma.order.delete({
            where: {
                id,
            },
        });
        res.status(200).json({
            success: true,
            message: "Order deleted successfully",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.deleteOrder = deleteOrder;
const cancelOrder = async (req, res) => {
    try {
        const id = req.params.id;
        const order = await prisma_1.prisma.order.findUnique({
            where: { id },
        });
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }
        if (order.status === "Delivered") {
            return res.status(400).json({
                success: false,
                message: "Cannot cancel deliverrd order",
            });
        }
        const updated = await prisma_1.prisma.order.update({
            where: { id },
            data: {
                status: "Canceled",
            },
        });
        res.json({
            success: true,
            message: "Order cancelled",
            order: updated,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Server code",
        });
    }
};
exports.cancelOrder = cancelOrder;
exports.updateOrderStatus = (0, express_async_handler_1.default)(async (req, res) => {
    const id = req.params.id;
    const { status } = req.body;
    const order = await prisma_1.prisma.order.update({
        where: { id },
        data: {
            status,
        },
    });
    res.json({
        success: true,
    });
});

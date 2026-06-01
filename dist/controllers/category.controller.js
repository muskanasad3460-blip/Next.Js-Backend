"use strict";
// import asyncHandler from "express-async-handler";
// import { Request, Response } from "express";
// import { prisma } from "../utils/prisma";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategoryProducts = exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.seedCategories = exports.getCategories = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const prisma_1 = require("../utils/prisma");
const categories_1 = __importDefault(require("../src/data/categories"));
//
// GET ALL CATEGORIES
//
exports.getCategories = (0, express_async_handler_1.default)(async (req, res) => {
    const { page = "1", limit = "10", search = "" } = req.query;
    const pageNumber = Number(page);
    const pageSize = Number(limit);
    const data = await prisma_1.prisma.category.findMany({
        where: {
            name: {
                contains: String(search),
                mode: "insensitive",
            },
        },
        include: {
            products: true,
        },
        skip: (pageNumber - 1) * pageSize,
        take: pageSize,
        orderBy: {
            createdAt: "desc",
        },
    });
    const total = await prisma_1.prisma.category.count({
        where: {
            name: {
                contains: String(search),
                mode: "insensitive",
            },
        },
    });
    res.status(200).json({
        categories: data,
        total,
        page: pageNumber,
        pages: Math.ceil(total / pageSize),
    });
});
//
// SEED CATEGORIES
//
exports.seedCategories = (0, express_async_handler_1.default)(async (req, res) => {
    await prisma_1.prisma.category.deleteMany();
    await prisma_1.prisma.category.createMany({
        data: categories_1.default,
    });
    res.status(201).json({
        message: "Categories seeded successfully",
    });
});
//
// CREATE CATEGORY
//
exports.createCategory = (0, express_async_handler_1.default)(async (req, res) => {
    const { name, icon } = req.body;
    if (!name) {
        res.status(400).json({
            message: "Category name required",
        });
        return;
    }
    const category = await prisma_1.prisma.category.create({
        data: {
            name,
            icon,
        },
    });
    res.status(201).json(category);
});
//
// UPDATE CATEGORY
//
exports.updateCategory = (0, express_async_handler_1.default)(async (req, res) => {
    const id = req.params.id;
    const { name, icon } = req.body;
    const category = await prisma_1.prisma.category.update({
        where: {
            id,
        },
        data: {
            name,
            icon,
        },
    });
    res.json({
        category,
    });
});
//
// DELETE CATEGORY
//
exports.deleteCategory = (0, express_async_handler_1.default)(async (req, res) => {
    const id = req.params.id;
    await prisma_1.prisma.category.delete({
        where: {
            id,
        },
    });
    res.json({
        message: "Category Deleted",
    });
});
//
// GET CATEGORY PRODUCTS
//
exports.getCategoryProducts = (0, express_async_handler_1.default)(async (req, res) => {
    const id = req.params.id;
    const products = await prisma_1.prisma.product.findMany({
        where: {
            categoryId: id,
        },
        include: {
            category: true,
        },
    });
    res.json({
        products,
    });
});

import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import asyncHandler from "express-async-handler";

// =========================
// CREATE ORDER
// =========================
export const createOrder = async (req: Request, res: Response) => {
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

    const order = await prisma.order.create({
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
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// =========================
// GET ALL ORDERS
// =========================
export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// =========================
// GET SINGLE ORDER
// =========================
export const getSingleOrder = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const order = await prisma.order.findUnique({
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// =========================
// DELETE ORDER
// =========================
export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const existingOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    await prisma.order.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const order = await prisma.order.findUnique({
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
    const updated = await prisma.order.update({
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server code",
    });
  }
};

export const updateOrderStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { status } = req.body;

    const order = await prisma.order.update({
      where: { id },
      data: {
        status,
      },
    });
    res.json({
      success: true,
    });
  }
);

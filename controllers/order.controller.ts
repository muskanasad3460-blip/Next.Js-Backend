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
      res.status(400).json({
        success: false,
        message: "First name is required",
      });
      return;
    }

    if (!products || products.length === 0) {
      res.status(400).json({
        success: false,
        message: "No products found",
      });
      return;
    }
    const userId = (req as any).user.id;

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

        orderItems: {
          create: products.map((item: any) => ({
            quantity: item.quantity || 1,
            unitPrice: item.price,

            product: {
              connect: {
                id: item.id,
              },
            },
          })),
        },

        user: {
          connect: {
            id: userId,
          },
        },
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
export const getOrders = asyncHandler(async (req, res) => {
  try {
    const userId = (req as any).user.id;

    const orders = await prisma.order.findMany({
      where: {
        userId: userId,
      },

      include: {
        orderItems: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to fetch orders",
    });
  }
});
// =========================
// GET SINGLE ORDER
// =========================
export const getSingleOrder = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;

    const order = await prisma.order.findUnique({
      where: {
        id,
      },

      include: {
        orderItems: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      order,
    });
  }
);
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
      res.status(404).json({
        success: false,
        message: "Order not found",
      });
      return;
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

// =========================
// CANCEL ORDER
// =========================
export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });
      return;
    }

    if (order.status === "Delivered") {
      res.status(400).json({
        success: false,
        message: "Cannot cancel delivered order",
      });
      return;
    }

    const updated = await prisma.order.update({
      where: { id },
      data: {
        status: "Cancelled",
      },
    });

    res.status(200).json({
      success: true,
      message: "Order cancelled",
      order: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// =========================
// UPDATE STATUS
// =========================
export const updateOrderStatus = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const { status } = req.body;

    const order = await prisma.order.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });

    res.status(200).json({
      success: true,
      message: "Order status updated",
      order,
    });
  }
);

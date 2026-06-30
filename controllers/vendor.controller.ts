import { Request, Response } from "express";
import * as VendorService from "../services/vendor.service";
import { prisma } from "../utils/prisma";

export const createVendor = async (req: Request, res: Response) => {
  try {
    const vendor = await VendorService.createVendor(req.body);

    res.status(201).json({
      success: true,
      message: "Vendor created successfully",
      data: vendor,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllVendors = async (_req: Request, res: Response) => {
  const vendors = await VendorService.getAllVendors();

  res.json({
    success: true,
    data: vendors,
  });
};

export const getVendor = async (req: Request, res: Response) => {
  const vendor = await VendorService.getVendor(Number(req.params.id));

  res.json({
    success: true,
    data: vendor,
  });
};

export const updateVendor = async (req: Request, res: Response) => {
  try {
    const vendor = await VendorService.updateVendor(
      Number(req.params.id),
      req.body
    );

    res.json({
      success: true,
      message: "Vendor updated successfully",
      data: vendor,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteVendor = async (req: Request, res: Response) => {
  await VendorService.deleteVendor(Number(req.params.id));

  res.json({
    success: true,
    message: "Vendor deleted successfully",
  });
};

export const getProfile = async (req: any, res: Response) => {
  try {
    const vendor = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        bio: true,
        role: true,
        createdAt: true,
      },
    });

    return res.status(200).json({
      success: true,
      data: vendor,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const vendorAnalytics = async (req: any, res: Response) => {
  try {
    const vendorId = req.user.id;

    // Vendor products
    const products = await prisma.product.findMany({
      where: {
        userId: vendorId,
      },
      include: {
        orderItems: {
          include: {
            order: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    const totalProducts = products.length;

    let totalRevenue = 0;
    let totalOrders = 0;

    const customerIds = new Set<number>();
    const orderMap = new Map();

    for (const product of products) {
      for (const item of product.orderItems) {
        totalRevenue += item.unitPrice * item.quantity;

        customerIds.add(item.order.userId);

        if (!orderMap.has(item.order.id)) {
          orderMap.set(item.order.id, item.order);
          totalOrders++;
        }
      }
    }

    const recentOrders = Array.from(orderMap.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5);

    const last7DaysRevenue = [];
    const last7DaysOrders = [];

    for (let i = 6; i >= 0; i--) {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      start.setDate(start.getDate() - i);

      const end = new Date(start);
      end.setDate(end.getDate() + 1);

      let revenue = 0;
      const dayOrders = new Set<string>();

      for (const product of products) {
        for (const item of product.orderItems) {
          if (item.order.createdAt >= start && item.order.createdAt < end) {
            revenue += item.unitPrice * item.quantity;
            dayOrders.add(item.order.id);
          }
        }
      }

      last7DaysRevenue.push({
        day: start.toLocaleDateString("en-US", {
          weekday: "short",
        }),
        revenue,
      });

      last7DaysOrders.push({
        day: start.toLocaleDateString("en-US", {
          weekday: "short",
        }),
        orders: dayOrders.size,
      });
    }

    return res.json({
      totalRevenue,
      totalOrders,
      totalProducts,
      totalCustomers: customerIds.size,
      last7DaysRevenue,
      last7DaysOrders,
      recentOrders,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Failed to load analytics",
    });
  }
};

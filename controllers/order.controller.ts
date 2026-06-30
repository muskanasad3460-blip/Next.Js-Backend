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
      order,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// =========================
// GET ORDERS
// =========================
export const getOrders = asyncHandler(async (req: any, res) => {
  const user = req.user;

  // CUSTOMER
  if (user.role === "USER") {
    const orders = await prisma.order.findMany({
      where: {
        userId: user.id,
      },
      include: {
        orderItems: {
          include: {
            product: {
              include: {
                images: true,
                category: true,
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
      success: true,
      orders,
    });
    return;
  }

  // SUPER ADMIN
  if (user.role === "SUPER_ADMIN") {
    const orders = await prisma.order.findMany({
      include: {
        user: true,
        orderItems: {
          include: {
            product: {
              include: {
                images: true,
                category: true,
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
      success: true,
      orders,
    });
    return;
  }

  // VENDOR
  const orders = await prisma.order.findMany({
    where: {
      orderItems: {
        some: {
          product: {
            userId: user.id,
          },
        },
      },
    },
    include: {
      user: true,
      orderItems: {
        where: {
          product: {
            userId: user.id,
          },
        },
        include: {
          product: {
            include: {
              images: true,
              category: true,
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
    success: true,
    orders,
  });
});

// =========================
// GET SINGLE ORDER
// =========================
export const getSingleOrder = asyncHandler(async (req: any, res) => {
  const user = req.user;
  const id = req.params.id;

  let order;

  if (user.role === "SUPER_ADMIN") {
    order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
        orderItems: {
          include: {
            product: {
              include: {
                images: true,
                category: true,
              },
            },
          },
        },
      },
    });
  } else if (user.role === "VENDOR") {
    order = await prisma.order.findFirst({
      where: {
        id,
        orderItems: {
          some: {
            product: {
              userId: user.id,
            },
          },
        },
      },
      include: {
        user: true,
        orderItems: {
          where: {
            product: {
              userId: user.id,
            },
          },
          include: {
            product: {
              include: {
                images: true,
                category: true,
              },
            },
          },
        },
      },
    });
  } else {
    order = await prisma.order.findFirst({
      where: {
        id,
        userId: user.id,
      },
      include: {
        orderItems: {
          include: {
            product: {
              include: {
                images: true,
                category: true,
              },
            },
          },
        },
      },
    });
  }

  if (!order) {
    res.status(404).json({
      success: false,
      message: "Order not found",
    });
    return;
  }

  res.json({
    success: true,
    order,
  });
});

// =========================
// DELETE ORDER
// =========================
export const deleteOrder = asyncHandler(async (req: any, res) => {
  const user = req.user;
  const id = req.params.id;

  const order = await prisma.order.findUnique({
    where: {
      id,
    },
    include: {
      orderItems: {
        include: {
          product: true,
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

  if (user.role !== "SUPER_ADMIN") {
    res.status(403).json({
      success: false,
      message: "Only admin can delete orders",
    });
    return;
  }

  await prisma.order.delete({
    where: {
      id,
    },
  });

  res.json({
    success: true,
    message: "Order deleted successfully",
  });
});

// =========================
// CANCEL ORDER
// =========================
export const cancelOrder = asyncHandler(async (req: any, res) => {
  const id = req.params.id;
  const user = req.user;

  const order = await prisma.order.findUnique({
    where: {
      id,
    },
  });

  if (!order) {
    res.status(404).json({
      success: false,
      message: "Order not found",
    });
    return;
  }

  if (user.role === "USER" && order.userId !== user.id) {
    res.status(403).json({
      success: false,
      message: "Forbidden",
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
    where: {
      id,
    },
    data: {
      status: "Cancelled",
    },
  });

  res.json({
    success: true,
    order: updated,
  });
});

// =========================
// UPDATE STATUS
// =========================
export const updateOrderStatus = asyncHandler(async (req: any, res) => {
  const id = req.params.id;
  const { status } = req.body;
  const user = req.user;

  if (user.role === "USER") {
    res.status(403).json({
      success: false,
      message: "Forbidden",
    });
    return;
  }

  if (user.role === "VENDOR") {
    const owns = await prisma.order.findFirst({
      where: {
        id,
        orderItems: {
          some: {
            product: {
              userId: user.id,
            },
          },
        },
      },
    });

    if (!owns) {
      res.status(403).json({
        success: false,
        message: "Forbidden",
      });
      return;
    }
  }

  const order = await prisma.order.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });

  res.json({
    success: true,
    order,
  });
});

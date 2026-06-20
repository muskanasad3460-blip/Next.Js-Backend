// import asyncHandler from "express-async-handler";
// import { prisma } from "../utils/prisma";

// export const analytics = asyncHandler(async (req, res) => {
//   const [
//     totalOrders,
//     totalUsers,
//     totalProductsInStore,
//     revenue,
//     totalProductsSoldResult,
//     recentOrders,
//     last7DaysStats,
//   ] = await Promise.all([
//     prisma.order.count(),

//     prisma.user.count(),

//     prisma.product.count(),

//     prisma.order.aggregate({
//       _sum: {
//         subtotal: true,
//       },
//     }),

//     prisma.$queryRaw<{ total: bigint }[]>`
//       SELECT COALESCE(
//         SUM((product->>'quantity')::int),
//         0
//       ) AS total
//       FROM "Order",
//       LATERAL jsonb_array_elements(products::jsonb) product
//     `,

//     prisma.order.findMany({
//       orderBy: {
//         createdAt: "desc",
//       },
//       // take: 10,
//     }),

//     prisma.$queryRaw<
//       {
//         date: string;
//         revenue: number;
//         orders: bigint;
//       }[]
//     >`
//       SELECT
//       // Convert date to string  =>

//         DATE("createdAt")::text AS date,
//         // Count number of rows per group
//         COUNT(*) AS orders,

//         COALESCE(SUM(subtotal), 0) AS revenue
//       FROM "Order"
//       // “Fetch only last 7 days of data starting from today going 6 days back.”
//       WHERE "createdAt" >= CURRENT_DATE - INTERVAL '6 days'
//       // “Merge same-day data together”
//       GROUP BY DATE("createdAt")
//       // “Sort the final result by date”
//       ORDER BY DATE("createdAt")
//     `,
//   ]);

//   const totalProductsSold = Number(totalProductsSoldResult[0]?.total || 0);

//   const last7Days = Array.from({ length: 7 }, (_, i) => {
//     const date = new Date();

//     date.setDate(date.getDate() - (6 - i));

//     return {
//       key: date.toISOString().split("T")[0],
//       day: date.toLocaleDateString("en-US", {
//         weekday: "short",
//       }),
//       revenue: 0,
//       orders: 0,
//     };
//   });

//   last7DaysStats.forEach((stat) => {
//     const day = last7Days.find((d) => d.key === stat.date);

//     if (day) {
//       day.revenue = Number(stat.revenue);
//       day.orders = Number(stat.orders);
//     }
//   });

//   const last7DaysRevenue = last7Days.map((day) => ({
//     day: day.day,
//     revenue: day.revenue,
//   }));

//   const last7DaysOrders = last7Days.map((day) => ({
//     day: day.day,
//     orders: day.orders,
//   }));

//   res.status(200).json({
//     success: true,

//     totalRevenue: revenue._sum.subtotal ?? 0,
//     totalOrders,
//     totalUsers,
//     totalProductsInStore,
//     totalProductsSold,

//     last7DaysRevenue,
//     last7DaysOrders,

//     recentOrders,
//   });
// });

import asyncHandler from "express-async-handler";
import { prisma } from "../utils/prisma";

export const analytics = asyncHandler(async (req, res) => {
  const [
    totalOrders,
    totalUsers,
    totalProductsInStore,
    revenue,
    totalProductsSoldResult,
    recentOrders,
    last7DaysStats,
  ] = await Promise.all([
    prisma.order.count(),

    prisma.user.count(),

    prisma.product.count(),

    prisma.order.aggregate({
      _sum: {
        subtotal: true,
      },
    }),

    // Total products sold
    prisma.orderItem.aggregate({
      _sum: {
        quantity: true,
      },
    }),

    // Recent orders
    prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),

    // Last 7 days analytics
    prisma.$queryRaw<
      {
        date: string;
        revenue: number;
        orders: bigint;
      }[]
    >`
      SELECT
        DATE("createdAt")::text AS date,
        COUNT(*) AS orders,
        COALESCE(SUM(subtotal), 0) AS revenue
      FROM "Order"
      WHERE "createdAt" >= CURRENT_DATE - INTERVAL '6 days'
      GROUP BY DATE("createdAt")
      ORDER BY DATE("createdAt")
    `,
  ]);

  const totalProductsSold = Number(totalProductsSoldResult._sum.quantity ?? 0);

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();

    date.setDate(date.getDate() - (6 - i));

    return {
      key: date.toISOString().split("T")[0],
      day: date.toLocaleDateString("en-US", {
        weekday: "short",
      }),
      revenue: 0,
      orders: 0,
    };
  });

  last7DaysStats.forEach((stat) => {
    const day = last7Days.find((d) => d.key === stat.date);

    if (day) {
      day.revenue = Number(stat.revenue);
      day.orders = Number(stat.orders);
    }
  });

  const last7DaysRevenue = last7Days.map((day) => ({
    day: day.day,
    revenue: day.revenue,
  }));

  const last7DaysOrders = last7Days.map((day) => ({
    day: day.day,
    orders: day.orders,
  }));

  res.status(200).json({
    success: true,

    totalRevenue: revenue._sum.subtotal ?? 0,
    totalOrders,
    totalUsers,
    totalProductsInStore,
    totalProductsSold,

    last7DaysRevenue,
    last7DaysOrders,

    recentOrders,
  });
});

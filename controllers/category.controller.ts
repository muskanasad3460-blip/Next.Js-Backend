// import { Request, Response } from "express";
// import asyncHandler from "express-async-handler";
// import { prisma } from "../utils/prisma";
// import categories from "../src/data/categories";

// //
// // GET ALL CATEGORIES
// //
// export const getCategories = asyncHandler(
//   async (req: Request, res: Response) => {
//     const page = Number(req.query.page || 1);
//     const limit = Number(req.query.limit || 10);
//     const search = String(req.query.search || "");

//     const where = {
//       deletedAt: null,
//       name: {
//         contains: search,
//         mode: "insensitive" as const,
//       },
//     };

//     const [data, total] = await Promise.all([
//       prisma.category.findMany({
//         where,
//         include: {
//           products: true,
//         },
//         skip: (page - 1) * limit,
//         take: limit,
//         orderBy: {
//           createdAt: "desc",
//         },
//       }),

//       prisma.category.count({
//         where,
//       }),
//     ]);

//     res.status(200).json({
//       success: true,
//       categories: data,
//       total,
//       page,
//       pages: Math.ceil(total / limit),
//     });
//   }
// );

// //
// // GET SINGLE CATEGORY
// //
// export const getCategory = asyncHandler(async (req: Request, res: Response) => {
//   const id = String(req.params.id);

//   const category = await prisma.category.findFirst({
//     where: {
//       id,
//       deletedAt: null,
//     },
//     include: {
//       products: true,
//     },
//   });

//   if (!category) {
//     res.status(404).json({
//       success: false,
//       message: "Category not found",
//     });
//     return;
//   }

//   res.status(200).json({
//     success: true,
//     category,
//   });
// });

// //
// // SEED CATEGORIES
// //
// export const seedCategories = asyncHandler(
//   async (req: Request, res: Response) => {
//     const admin = await prisma.user.findFirst({
//       where: {
//         role: "SUPER_ADMIN",
//       },
//     });

//     if (!admin) {
//       res.status(400).json({
//         success: false,
//         message: "Admin user not found",
//       });
//       return;
//     }

//     await prisma.category.deleteMany();

//     await prisma.category.createMany({
//       data: categories.map((category) => ({
//         name: category.name,
//         icon: category.icon,
//         userId: admin.id,
//       })),
//     });

//     res.status(201).json({
//       success: true,
//       message: "Categories seeded successfully",
//     });
//   }
// );

// //
// // CREATE CATEGORY
// //
// export const createCategory = asyncHandler(
//   async (req: Request, res: Response) => {
//     const { name, icon } = req.body;

//     if (!name || !icon) {
//       res.status(400).json({
//         success: false,
//         message: "Name and icon are required",
//       });
//       return;
//     }

//     const existing = await prisma.category.findUnique({
//       where: {
//         name,
//       },
//     });

//     if (existing) {
//       res.status(400).json({
//         success: false,
//         message: "Category already exists",
//       });
//       return;
//     }

//     const userId = (req as any).user.id;

//     const category = await prisma.category.create({
//       data: {
//         name,
//         icon,
//         userId,
//       },
//     });

//     res.status(201).json({
//       success: true,
//       category,
//     });
//   }
// );

// //
// // UPDATE CATEGORY
// //
// export const updateCategory = asyncHandler(
//   async (req: Request, res: Response) => {
//     const id = String(req.params.id);
//     const { name, icon } = req.body;

//     const existing = await prisma.category.findFirst({
//       where: {
//         id,
//         deletedAt: null,
//       },
//     });

//     if (!existing) {
//       res.status(404).json({
//         success: false,
//         message: "Category not found",
//       });
//       return;
//     }

//     const category = await prisma.category.update({
//       where: {
//         id,
//       },
//       data: {
//         name,
//         icon,
//       },
//     });

//     res.status(200).json({
//       success: true,
//       category,
//     });
//   }
// );

// //
// // DELETE CATEGORY (SOFT DELETE)
// //
// export const deleteCategory = asyncHandler(
//   async (req: Request, res: Response) => {
//     const id = String(req.params.id);

//     const existing = await prisma.category.findFirst({
//       where: {
//         id,
//         deletedAt: null,
//       },
//     });

//     if (!existing) {
//       res.status(404).json({
//         success: false,
//         message: "Category not found",
//       });
//       return;
//     }

//     await prisma.category.update({
//       where: {
//         id,
//       },
//       data: {
//         deletedAt: new Date(),
//       },
//     });

//     res.status(200).json({
//       success: true,
//       message: "Category deleted successfully",
//     });
//   }
// );

import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { prisma } from "../utils/prisma";
import categories from "../src/data/categories";

//
// GET ALL CATEGORIES
//
export const getCategories = asyncHandler(
  async (req: Request, res: Response) => {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const search = String(req.query.search || "");

    const user = (req as any).user;

    const where: any = {
      deletedAt: null,
      name: {
        contains: search,
        mode: "insensitive",
      },
    };

    // Vendors only see their own categories
    if (user.role !== "SUPER_ADMIN") {
      where.userId = user.id;
    }

    const [data, total] = await Promise.all([
      prisma.category.findMany({
        where,
        include: {
          products: true,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.category.count({
        where,
      }),
    ]);

    res.status(200).json({
      success: true,
      categories: data,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  }
);

//
// GET SINGLE CATEGORY
//
export const getCategory = asyncHandler(async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const user = (req as any).user;

  const where: any = {
    id,
    deletedAt: null,
  };

  // Vendors can only view their own category
  if (user.role !== "SUPER_ADMIN") {
    where.userId = user.id;
  }

  const category = await prisma.category.findFirst({
    where,
    include: {
      products: true,
    },
  });

  if (!category) {
    res.status(404).json({
      success: false,
      message: "Category not found",
    });
    return;
  }

  res.status(200).json({
    success: true,
    category,
  });
});

//
// SEED CATEGORIES
//
export const seedCategories = asyncHandler(
  async (req: Request, res: Response) => {
    const admin = await prisma.user.findFirst({
      where: {
        role: "SUPER_ADMIN",
      },
    });

    if (!admin) {
      res.status(400).json({
        success: false,
        message: "Admin user not found",
      });
      return;
    }

    await prisma.category.deleteMany();

    await prisma.category.createMany({
      data: categories.map((category) => ({
        name: category.name,
        icon: category.icon,
        userId: admin.id,
      })),
    });

    res.status(201).json({
      success: true,
      message: "Categories seeded successfully",
    });
  }
);

//
// CREATE CATEGORY
//
export const createCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, icon } = req.body;

    if (!name || !icon) {
      res.status(400).json({
        success: false,
        message: "Name and icon are required",
      });
      return;
    }

    const user = (req as any).user;

    // Vendor can duplicate admin category names if needed
    const existing = await prisma.category.findFirst({
      where: {
        name,
        userId: user.id,
        deletedAt: null,
      },
    });

    if (existing) {
      res.status(400).json({
        success: false,
        message: "Category already exists",
      });
      return;
    }

    const category = await prisma.category.create({
      data: {
        name,
        icon,
        userId: user.id,
      },
    });

    res.status(201).json({
      success: true,
      category,
    });
  }
);

//
// UPDATE CATEGORY
//
export const updateCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const id = String(req.params.id);
    const { name, icon } = req.body;

    const user = (req as any).user;

    const where: any = {
      id,
      deletedAt: null,
    };

    // Vendor can update only own category
    if (user.role !== "SUPER_ADMIN") {
      where.userId = user.id;
    }

    const existing = await prisma.category.findFirst({
      where,
    });

    if (!existing) {
      res.status(404).json({
        success: false,
        message: "Category not found",
      });
      return;
    }

    const category = await prisma.category.update({
      where: {
        id,
      },
      data: {
        name,
        icon,
      },
    });

    res.status(200).json({
      success: true,
      category,
    });
  }
);

//
// DELETE CATEGORY
//
export const deleteCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const id = String(req.params.id);
    const user = (req as any).user;

    const where: any = {
      id,
      deletedAt: null,
    };

    // Vendor can delete only own category
    if (user.role !== "SUPER_ADMIN") {
      where.userId = user.id;
    }

    const existing = await prisma.category.findFirst({
      where,
    });

    if (!existing) {
      res.status(404).json({
        success: false,
        message: "Category not found",
      });
      return;
    }

    await prisma.category.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  }
);

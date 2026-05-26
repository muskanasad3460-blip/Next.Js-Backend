-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "companyName" TEXT,
    "streetAddress" TEXT NOT NULL,
    "apartment" TEXT,
    "city" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Processing',
    "products" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

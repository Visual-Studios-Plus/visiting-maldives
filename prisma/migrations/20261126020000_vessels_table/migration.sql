-- CreateTable
CREATE TABLE "vessels" (
    "id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "registration" TEXT,
    "licence" TEXT,
    "cabins" INTEGER,
    "beds" INTEGER,
    "phone" TEXT,
    "fax" TEXT,
    "email" TEXT,
    "operator" TEXT,
    "atoll" TEXT,
    "atoll_slug" TEXT,
    "image" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "licensed" BOOLEAN,
    "author" TEXT,
    "updated_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vessels_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "vessels_sort_order_idx" ON "vessels"("sort_order");

-- CreateIndex
CREATE INDEX "vessels_atoll_slug_idx" ON "vessels"("atoll_slug");

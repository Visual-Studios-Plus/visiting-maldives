-- CreateTable
CREATE TABLE "stays" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "atoll" TEXT NOT NULL DEFAULT '',
    "atoll_slug" TEXT,
    "island" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "price" TEXT NOT NULL DEFAULT '',
    "note" TEXT NOT NULL DEFAULT '',
    "about" TEXT NOT NULL DEFAULT '',
    "image" TEXT NOT NULL DEFAULT '',
    "partner" BOOLEAN NOT NULL DEFAULT false,
    "rating" DOUBLE PRECISION,
    "rooms" INTEGER,
    "beds" INTEGER,
    "berths" INTEGER,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "licensed" BOOLEAN NOT NULL DEFAULT false,
    "amenities" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "author" TEXT,
    "updated_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stays_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stay_facts" (
    "id" SERIAL NOT NULL,
    "stay_id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "stay_facts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stay_photos" (
    "id" SERIAL NOT NULL,
    "stay_id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "src" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "caption" TEXT,

    CONSTRAINT "stay_photos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stay_reviews" (
    "id" SERIAL NOT NULL,
    "stay_id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "author" TEXT NOT NULL,
    "from" TEXT NOT NULL DEFAULT '',
    "date" TEXT NOT NULL DEFAULT '',
    "rating" DOUBLE PRECISION NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "stay_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "stays_slug_key" ON "stays"("slug");

-- CreateIndex
CREATE INDEX "stays_atoll_slug_idx" ON "stays"("atoll_slug");

-- CreateIndex
CREATE INDEX "stays_type_idx" ON "stays"("type");

-- CreateIndex
CREATE INDEX "stays_position_idx" ON "stays"("position");

-- CreateIndex
CREATE INDEX "stay_facts_stay_id_idx" ON "stay_facts"("stay_id");

-- CreateIndex
CREATE INDEX "stay_photos_stay_id_idx" ON "stay_photos"("stay_id");

-- CreateIndex
CREATE INDEX "stay_reviews_stay_id_idx" ON "stay_reviews"("stay_id");

-- AddForeignKey
ALTER TABLE "stay_facts" ADD CONSTRAINT "stay_facts_stay_id_fkey" FOREIGN KEY ("stay_id") REFERENCES "stays"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stay_photos" ADD CONSTRAINT "stay_photos_stay_id_fkey" FOREIGN KEY ("stay_id") REFERENCES "stays"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stay_reviews" ADD CONSTRAINT "stay_reviews_stay_id_fkey" FOREIGN KEY ("stay_id") REFERENCES "stays"("id") ON DELETE CASCADE ON UPDATE CASCADE;


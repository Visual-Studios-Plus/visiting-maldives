-- CreateTable
CREATE TABLE "guides" (
    "id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "short" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "atoll" TEXT NOT NULL,
    "season" TEXT NOT NULL,
    "read" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    "author" TEXT,
    "updated_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "guides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guide_sections" (
    "id" SERIAL NOT NULL,
    "owner_id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "heading" TEXT NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "guide_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guide_facts" (
    "id" SERIAL NOT NULL,
    "owner_id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "guide_facts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guide_photos" (
    "id" SERIAL NOT NULL,
    "owner_id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "src" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "caption" TEXT,

    CONSTRAINT "guide_photos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "atolls" (
    "id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dhivehi" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "intro" TEXT NOT NULL,
    "best_for" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "transfer" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "parent" TEXT,
    "islands_inhabited" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "islands_uninhabited" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "islands_resort_islands" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "has_islands" BOOLEAN NOT NULL DEFAULT false,
    "author" TEXT,
    "updated_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "atolls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "atoll_photos" (
    "id" SERIAL NOT NULL,
    "owner_id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "src" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "caption" TEXT,

    CONSTRAINT "atoll_photos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "atoll_sections" (
    "id" SERIAL NOT NULL,
    "owner_id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "heading" TEXT NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "atoll_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "atoll_facts" (
    "id" SERIAL NOT NULL,
    "owner_id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "atoll_facts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "atoll_resorts" (
    "id" SERIAL NOT NULL,
    "owner_id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "island" TEXT NOT NULL,
    "resort" TEXT NOT NULL,

    CONSTRAINT "atoll_resorts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "atoll_half_resorts" (
    "id" SERIAL NOT NULL,
    "owner_id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "island" TEXT NOT NULL,
    "resort" TEXT NOT NULL,

    CONSTRAINT "atoll_half_resorts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "islands" (
    "id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "atoll" TEXT NOT NULL,
    "atoll_slug" TEXT,
    "kind" TEXT NOT NULL,
    "tagline" TEXT,
    "description" TEXT NOT NULL,
    "population" INTEGER,
    "population_year" TEXT,
    "area" DOUBLE PRECISION,
    "image" TEXT,
    "image_credit" TEXT,
    "image_source" TEXT,
    "source" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "highlights" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "getting_there" TEXT,
    "author" TEXT,
    "updated_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "islands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "island_photos" (
    "id" SERIAL NOT NULL,
    "owner_id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "src" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "caption" TEXT,

    CONSTRAINT "island_photos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "island_sections" (
    "id" SERIAL NOT NULL,
    "owner_id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "heading" TEXT NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "island_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eats" (
    "id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "slug" TEXT,
    "name" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "atoll" TEXT,
    "atoll_slug" TEXT,
    "island" TEXT,
    "area" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "dish" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "about" TEXT,
    "hours" TEXT,
    "rating" DOUBLE PRECISION,
    "address" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "author" TEXT,
    "updated_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "eats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eat_recommends" (
    "id" SERIAL NOT NULL,
    "owner_id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "dish" TEXT NOT NULL,
    "note" TEXT NOT NULL,

    CONSTRAINT "eat_recommends_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eat_reviews" (
    "id" SERIAL NOT NULL,
    "owner_id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "author" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "eat_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dishes" (
    "id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "local" TEXT,
    "kind" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "where_to_try" TEXT,
    "image" TEXT NOT NULL,
    "vegetarian" BOOLEAN,
    "author" TEXT,
    "updated_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dishes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "month" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "place" TEXT NOT NULL,
    "author" TEXT,
    "updated_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "essentials" (
    "id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "big" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "href" TEXT,
    "author" TEXT,
    "updated_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "essentials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "salons" (
    "id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "slug" TEXT,
    "name" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "services" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "atoll" TEXT,
    "atoll_slug" TEXT,
    "island" TEXT,
    "area" TEXT NOT NULL,
    "address" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "rating" DOUBLE PRECISION,
    "image" TEXT NOT NULL,
    "about" TEXT,
    "hours" TEXT,
    "phone" TEXT,
    "link" TEXT,
    "author" TEXT,
    "updated_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "salons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "salon_reviews" (
    "id" SERIAL NOT NULL,
    "owner_id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "author" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "salon_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "page_sections" (
    "id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL,
    "display_order" INTEGER,
    "placement" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "atoll" TEXT,
    "atoll_slug" TEXT,
    "island" TEXT,
    "page_slug" TEXT,
    "page_title" TEXT,
    "slot" TEXT NOT NULL,
    "eyebrow" TEXT,
    "intro" TEXT,
    "block" TEXT NOT NULL,
    "source" TEXT,
    "area" TEXT,
    "kind_filter" TEXT,
    "max_items" INTEGER,
    "body" TEXT,
    "image" TEXT,
    "image_side" TEXT,
    "button_label" TEXT,
    "button_link" TEXT,
    "author" TEXT,
    "updated_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "page_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "page_section_items" (
    "id" SERIAL NOT NULL,
    "owner_id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT,
    "image" TEXT,
    "link" TEXT,

    CONSTRAINT "page_section_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "guides_slug_key" ON "guides"("slug");

-- CreateIndex
CREATE INDEX "guides_sort_order_idx" ON "guides"("sort_order");

-- CreateIndex
CREATE INDEX "guides_category_idx" ON "guides"("category");

-- CreateIndex
CREATE INDEX "guide_sections_owner_id_idx" ON "guide_sections"("owner_id");

-- CreateIndex
CREATE INDEX "guide_facts_owner_id_idx" ON "guide_facts"("owner_id");

-- CreateIndex
CREATE INDEX "guide_photos_owner_id_idx" ON "guide_photos"("owner_id");

-- CreateIndex
CREATE UNIQUE INDEX "atolls_slug_key" ON "atolls"("slug");

-- CreateIndex
CREATE INDEX "atolls_sort_order_idx" ON "atolls"("sort_order");

-- CreateIndex
CREATE INDEX "atolls_parent_idx" ON "atolls"("parent");

-- CreateIndex
CREATE INDEX "atoll_photos_owner_id_idx" ON "atoll_photos"("owner_id");

-- CreateIndex
CREATE INDEX "atoll_sections_owner_id_idx" ON "atoll_sections"("owner_id");

-- CreateIndex
CREATE INDEX "atoll_facts_owner_id_idx" ON "atoll_facts"("owner_id");

-- CreateIndex
CREATE INDEX "atoll_resorts_owner_id_idx" ON "atoll_resorts"("owner_id");

-- CreateIndex
CREATE INDEX "atoll_half_resorts_owner_id_idx" ON "atoll_half_resorts"("owner_id");

-- CreateIndex
CREATE INDEX "islands_sort_order_idx" ON "islands"("sort_order");

-- CreateIndex
CREATE INDEX "islands_slug_idx" ON "islands"("slug");

-- CreateIndex
CREATE INDEX "islands_atoll_slug_idx" ON "islands"("atoll_slug");

-- CreateIndex
CREATE INDEX "island_photos_owner_id_idx" ON "island_photos"("owner_id");

-- CreateIndex
CREATE INDEX "island_sections_owner_id_idx" ON "island_sections"("owner_id");

-- CreateIndex
CREATE INDEX "eats_sort_order_idx" ON "eats"("sort_order");

-- CreateIndex
CREATE INDEX "eats_slug_idx" ON "eats"("slug");

-- CreateIndex
CREATE INDEX "eats_atoll_slug_idx" ON "eats"("atoll_slug");

-- CreateIndex
CREATE INDEX "eat_recommends_owner_id_idx" ON "eat_recommends"("owner_id");

-- CreateIndex
CREATE INDEX "eat_reviews_owner_id_idx" ON "eat_reviews"("owner_id");

-- CreateIndex
CREATE INDEX "dishes_sort_order_idx" ON "dishes"("sort_order");

-- CreateIndex
CREATE INDEX "events_sort_order_idx" ON "events"("sort_order");

-- CreateIndex
CREATE INDEX "essentials_sort_order_idx" ON "essentials"("sort_order");

-- CreateIndex
CREATE INDEX "salons_sort_order_idx" ON "salons"("sort_order");

-- CreateIndex
CREATE INDEX "salons_slug_idx" ON "salons"("slug");

-- CreateIndex
CREATE INDEX "salons_atoll_slug_idx" ON "salons"("atoll_slug");

-- CreateIndex
CREATE INDEX "salon_reviews_owner_id_idx" ON "salon_reviews"("owner_id");

-- CreateIndex
CREATE INDEX "page_sections_sort_order_idx" ON "page_sections"("sort_order");

-- CreateIndex
CREATE INDEX "page_sections_atoll_slug_idx" ON "page_sections"("atoll_slug");

-- CreateIndex
CREATE INDEX "page_sections_page_slug_idx" ON "page_sections"("page_slug");

-- CreateIndex
CREATE INDEX "page_section_items_owner_id_idx" ON "page_section_items"("owner_id");

-- AddForeignKey
ALTER TABLE "guide_sections" ADD CONSTRAINT "guide_sections_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "guides"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guide_facts" ADD CONSTRAINT "guide_facts_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "guides"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guide_photos" ADD CONSTRAINT "guide_photos_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "guides"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "atoll_photos" ADD CONSTRAINT "atoll_photos_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "atolls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "atoll_sections" ADD CONSTRAINT "atoll_sections_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "atolls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "atoll_facts" ADD CONSTRAINT "atoll_facts_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "atolls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "atoll_resorts" ADD CONSTRAINT "atoll_resorts_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "atolls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "atoll_half_resorts" ADD CONSTRAINT "atoll_half_resorts_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "atolls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "island_photos" ADD CONSTRAINT "island_photos_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "islands"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "island_sections" ADD CONSTRAINT "island_sections_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "islands"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eat_recommends" ADD CONSTRAINT "eat_recommends_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "eats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eat_reviews" ADD CONSTRAINT "eat_reviews_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "eats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salon_reviews" ADD CONSTRAINT "salon_reviews_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "salons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "page_section_items" ADD CONSTRAINT "page_section_items_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "page_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;


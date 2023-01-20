-- CreateTable
CREATE TABLE "Channels" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "background" TEXT NOT NULL,

    CONSTRAINT "Channels_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comments" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "storyId" INTEGER NOT NULL,
    "text" VARCHAR(255) NOT NULL,

    CONSTRAINT "Comments_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Denunciations" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "storyId" INTEGER NOT NULL,
    "text" VARCHAR(255) NOT NULL,

    CONSTRAINT "Denunciations_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Likes" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "storyId" INTEGER NOT NULL,
    "date" DATE NOT NULL DEFAULT '2023-01-20'::date,

    CONSTRAINT "Likes_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notifications" (
    "id" SERIAL NOT NULL,
    "toUserId" INTEGER NOT NULL,
    "text" VARCHAR(255) NOT NULL,
    "date" DATE NOT NULL DEFAULT '2023-01-20'::date,
    "typeId" INTEGER NOT NULL,

    CONSTRAINT "Notifications_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationsTypes" (
    "id" SERIAL NOT NULL,
    "type" VARCHAR(255) NOT NULL,

    CONSTRAINT "NotificationsTypes_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ranks" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "color" TEXT NOT NULL,

    CONSTRAINT "Ranks_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sessions" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Sessions_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stories" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(30) NOT NULL,
    "body" VARCHAR(1000) NOT NULL,
    "date" DATE NOT NULL DEFAULT '2023-01-20'::date,
    "status" VARCHAR(255) NOT NULL DEFAULT 'active',
    "userId" INTEGER NOT NULL,
    "channelId" INTEGER NOT NULL,

    CONSTRAINT "Stories_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(25) NOT NULL,
    "avatar" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "about" VARCHAR(50) NOT NULL,
    "status" VARCHAR(255) NOT NULL DEFAULT 'active',
    "rankId" INTEGER NOT NULL,

    CONSTRAINT "Users_pk" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Channels_name_key" ON "Channels"("name");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationsTypes_type_key" ON "NotificationsTypes"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Ranks_name_key" ON "Ranks"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Ranks_color_key" ON "Ranks"("color");

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_fk0" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_fk1" FOREIGN KEY ("storyId") REFERENCES "Stories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Denunciations" ADD CONSTRAINT "Denunciations_fk0" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Denunciations" ADD CONSTRAINT "Denunciations_fk1" FOREIGN KEY ("storyId") REFERENCES "Stories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Likes" ADD CONSTRAINT "Likes_fk0" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Likes" ADD CONSTRAINT "Likes_fk1" FOREIGN KEY ("storyId") REFERENCES "Stories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_fk0" FOREIGN KEY ("toUserId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_fk1" FOREIGN KEY ("typeId") REFERENCES "NotificationsTypes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Sessions" ADD CONSTRAINT "Sessions_fk0" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Stories" ADD CONSTRAINT "Stories_fk0" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Stories" ADD CONSTRAINT "Stories_fk1" FOREIGN KEY ("channelId") REFERENCES "Channels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_fk0" FOREIGN KEY ("rankId") REFERENCES "Ranks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

CREATE TABLE "jobs" (
  "id" INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL ,
  "title" VARCHAR UNIQUE
);

CREATE TABLE "tags" (
  "id" INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL ,
  "name" VARCHAR UNIQUE ,
  "original" BOOL DEFAULT false,
  is_deleted BOOL DEFAULT false,
  "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE  TABLE "main"."languages" (
  "id" INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL ,
  "name" VARCHAR NOT NULL  UNIQUE
);

CREATE  TABLE "main"."answers" (
  "id" INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL ,
  "job_id" INTEGER NOT NULL ,
  "language_id" INTEGER NOT NULL ,
  "opinion" TEXT,
  "ip" VARCHAR NOT NULL,
  "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE  TABLE "main"."answers_tags" (
  "answer_id" INTEGER NOT NULL ,
  "tag_id" INTEGER NOT NULL
);

CREATE UNIQUE INDEX "main"."idx_answers_tags" ON "answers_tags" ("answer_id" ASC, "tag_id" ASC);
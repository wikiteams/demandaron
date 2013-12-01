CREATE TABLE "tags" (
  "id" INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL ,
  "name" VARCHAR UNIQUE ,
  "original" BOOL DEFAULT false,
  "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP
);

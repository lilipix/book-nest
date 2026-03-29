import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateBookEntity1774743656390 implements MigrationInterface {
    name = 'UpdateBookEntity1774743656390'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying, "email" character varying NOT NULL, "role" character varying NOT NULL DEFAULT 'user', "hashedPassword" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "profilePicture" character varying, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."book_status_enum" AS ENUM('TO_READ', 'READ', 'UNREAD')`);
        await queryRunner.query(`CREATE TABLE "book" ("id" SERIAL NOT NULL, "isbn" character varying, "title" character varying NOT NULL, "author" character varying NOT NULL, "image" character varying, "description" character varying, "status" "public"."book_status_enum" NOT NULL DEFAULT 'UNREAD', "isFavorite" boolean NOT NULL, "isBorrowed" boolean NOT NULL DEFAULT false, "borrowedAt" TIMESTAMP, "borrowedBy" character varying, "returnedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_9a180d22ddb2ef9d496539e534c" UNIQUE ("title", "author"), CONSTRAINT "PK_a3afef72ec8f80e6e5c310b28a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_bd183604b9c828c0bdd92cafab" ON "book" ("isbn") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_bd183604b9c828c0bdd92cafab"`);
        await queryRunner.query(`DROP TABLE "book"`);
        await queryRunner.query(`DROP TYPE "public"."book_status_enum"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDatabase1776096150131 implements MigrationInterface {
    name = 'UpdateDatabase1776096150131'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "book_metadata" ("id" integer GENERATED ALWAYS AS IDENTITY NOT NULL, "isbn" character varying(20), "title" character varying(500) NOT NULL, "author" character varying(255) NOT NULL, "image" text, "description" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_fa3b44974e8f419e5fcd7f6c446" UNIQUE ("isbn"), CONSTRAINT "PK_f205bf3645857fedd6e054d877d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_book_state_status_enum" AS ENUM('READ', 'UNREAD', 'TO_READ')`);
        await queryRunner.query(`CREATE TABLE "user_book_state" ("id" integer GENERATED ALWAYS AS IDENTITY NOT NULL, "status" "public"."user_book_state_status_enum" NOT NULL DEFAULT 'UNREAD', "isFavorite" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "familyLibraryBookId" integer, CONSTRAINT "UQ_d9b70e8eefffc9b7dd5a9b2f2f6" UNIQUE ("userId", "familyLibraryBookId"), CONSTRAINT "PK_9979847ba7dca6edb7159ac55e8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "family_library_book" ("id" integer GENERATED ALWAYS AS IDENTITY NOT NULL, "isBorrowed" boolean NOT NULL DEFAULT false, "borrowedBy" character varying(150), "borrowedAt" TIMESTAMP, "returnedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "familyLibraryId" integer, "bookMetadataId" integer, CONSTRAINT "UQ_6c2948baafa9c4373edb2cfe0d5" UNIQUE ("familyLibraryId", "bookMetadataId"), CONSTRAINT "PK_6b8d300ad0e004f1a16fcec9e40" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "family_library" ("id" integer GENERATED ALWAYS AS IDENTITY NOT NULL, "name" character varying(100) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2db6a445ab5ef44beff52a2bbf1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."family_member_role_enum" AS ENUM('OWNER', 'MEMBER')`);
        await queryRunner.query(`CREATE TABLE "family_member" ("id" integer GENERATED ALWAYS AS IDENTITY NOT NULL, "role" "public"."family_member_role_enum" NOT NULL DEFAULT 'MEMBER', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "familyLibraryId" integer, CONSTRAINT "UQ_0b0a855521a7c181f896ef32328" UNIQUE ("userId", "familyLibraryId"), CONSTRAINT "PK_a391876af9dee0ed209028b0176" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "hashedPassword"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "profilePicture"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "first_name" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "last_name" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "isVerified" boolean NOT NULL DEFAULT 'false'`);
        await queryRunner.query(`ALTER TABLE "user" ADD "hashed_password" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ADD "hashed_reset_token" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "reset_token_expires_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "email" citext NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`);
        await queryRunner.query(`CREATE TYPE "public"."userRole" AS ENUM('user', 'admin')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "role" "public"."userRole" NOT NULL DEFAULT 'user'`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "CHK_4f69a898cf8bc164cda3b0e957" CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "CHK_577ea0c1e32487ec5af01389aa" CHECK (char_length(last_name) >= 2)`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "CHK_e0c3fabdbfb51b4ae5a707351d" CHECK (char_length(first_name) >= 2)`);
        await queryRunner.query(`ALTER TABLE "user_book_state" ADD CONSTRAINT "FK_a57fc07d5d1e4fa2638b40a5262" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_book_state" ADD CONSTRAINT "FK_5df5c1387ccd9c1a1471cacc814" FOREIGN KEY ("familyLibraryBookId") REFERENCES "family_library_book"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "family_library_book" ADD CONSTRAINT "FK_bf9e45d853d7f4721ca50a7bbb8" FOREIGN KEY ("familyLibraryId") REFERENCES "family_library"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "family_library_book" ADD CONSTRAINT "FK_eff55a5054debf50b30c1075a01" FOREIGN KEY ("bookMetadataId") REFERENCES "book_metadata"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "family_member" ADD CONSTRAINT "FK_3562f33f65550c291c984f6f116" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "family_member" ADD CONSTRAINT "FK_b80859e576b562660cccbd4d057" FOREIGN KEY ("familyLibraryId") REFERENCES "family_library"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "family_member" DROP CONSTRAINT "FK_b80859e576b562660cccbd4d057"`);
        await queryRunner.query(`ALTER TABLE "family_member" DROP CONSTRAINT "FK_3562f33f65550c291c984f6f116"`);
        await queryRunner.query(`ALTER TABLE "family_library_book" DROP CONSTRAINT "FK_eff55a5054debf50b30c1075a01"`);
        await queryRunner.query(`ALTER TABLE "family_library_book" DROP CONSTRAINT "FK_bf9e45d853d7f4721ca50a7bbb8"`);
        await queryRunner.query(`ALTER TABLE "user_book_state" DROP CONSTRAINT "FK_5df5c1387ccd9c1a1471cacc814"`);
        await queryRunner.query(`ALTER TABLE "user_book_state" DROP CONSTRAINT "FK_a57fc07d5d1e4fa2638b40a5262"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "CHK_e0c3fabdbfb51b4ae5a707351d"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "CHK_577ea0c1e32487ec5af01389aa"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "CHK_4f69a898cf8bc164cda3b0e957"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`);
        await queryRunner.query(`DROP TYPE "public"."userRole"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "role" character varying NOT NULL DEFAULT 'user'`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "email" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "reset_token_expires_at"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "hashed_reset_token"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "hashed_password"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isVerified"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "last_name"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "first_name"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "profilePicture" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ADD "hashedPassword" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "name" character varying`);
        await queryRunner.query(`DROP TABLE "family_member"`);
        await queryRunner.query(`DROP TYPE "public"."family_member_role_enum"`);
        await queryRunner.query(`DROP TABLE "family_library"`);
        await queryRunner.query(`DROP TABLE "family_library_book"`);
        await queryRunner.query(`DROP TABLE "user_book_state"`);
        await queryRunner.query(`DROP TYPE "public"."user_book_state_status_enum"`);
        await queryRunner.query(`DROP TABLE "book_metadata"`);
    }

}

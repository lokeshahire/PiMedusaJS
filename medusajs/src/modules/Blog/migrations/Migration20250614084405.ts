import { Migration } from '@mikro-orm/migrations';

export class Migration20250614084405 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "blog" ("id" text not null, "name" text not null, "title" text not null, "description" text not null, "email" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "blog_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_blog_deleted_at" ON "blog" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "blog" cascade;`);
  }

}

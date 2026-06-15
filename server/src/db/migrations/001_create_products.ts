import { Knex } from 'knex';

export async function up(knex: Knex) {
  await knex.schema.createTable('categories', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.string('name').notNullable();
    t.timestamps(true, true);
  });

  await knex.schema.createTable('products', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('category_id').references('id').inTable('categories').onDelete('SET NULL');
    t.string('name').notNullable();
    t.string('sku').notNullable().unique();
    t.decimal('price', 10, 2).notNullable();
    t.integer('stock_qty').defaultTo(0);
    t.integer('low_stock_threshold').defaultTo(10);
    t.timestamps(true, true);
  });
}

export async function down(knex: Knex) {
  await knex.schema.dropTableIfExists('products');
  await knex.schema.dropTableIfExists('categories');
}
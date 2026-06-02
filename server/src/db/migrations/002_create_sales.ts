import { Knex } from 'knex';

export async function up(knex: Knex) {
  await knex.schema.createTable('sales', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.decimal('total_amount', 12, 2).notNullable();
    t.text('notes');
    t.timestamp('sold_at').defaultTo(knex.fn.now());
    t.timestamps(true, true);
  });

  await knex.schema.createTable('sale_items', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('sale_id').references('id').inTable('sales').onDelete('CASCADE');
    t.uuid('product_id').references('id').inTable('products').onDelete('SET NULL');
    t.integer('quantity').notNullable();
    t.decimal('unit_price', 10, 2).notNullable();
    t.timestamps(true, true);
  });
}

export async function down(knex: Knex) {
  await knex.schema.dropTableIfExists('sale_items');
  await knex.schema.dropTableIfExists('sales');
}
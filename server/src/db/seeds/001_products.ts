import { Knex } from 'knex';

export async function seed(knex: Knex) {
  await knex('products').del();
  await knex('categories').del();

  const [category] = await knex('categories').insert({ name: 'General' }).returning('id');

  await knex('products').insert([
    { category_id: category.id, name: 'Laptop', sku: 'LAP-001', price: 999.99, stock_qty: 25, low_stock_threshold: 5 },
    { category_id: category.id, name: 'Mouse', sku: 'MOU-001', price: 29.99, stock_qty: 8, low_stock_threshold: 10 },
    { category_id: category.id, name: 'Keyboard', sku: 'KEY-001', price: 79.99, stock_qty: 3, low_stock_threshold: 5 },
  ]);
}
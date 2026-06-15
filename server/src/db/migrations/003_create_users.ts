import { Knex } from 'knex';

export async function up(knex: Knex) {
  await knex.schema.createTable('users', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.string('email').notNullable().unique();
    t.string('password').notNullable();
    t.string('role').defaultTo('staff');
    t.timestamps(true, true);
  });
}

export async function down(knex: Knex) {
  await knex.schema.dropTableIfExists('users');
}
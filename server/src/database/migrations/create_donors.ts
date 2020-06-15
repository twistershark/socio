import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('donors', table => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('email').notNullable();
        table.string('phoneNumber').notNullable();
        table.string('phoneDDD', 2).notNullable();
        table.string('document').notNullable();
        table.string('postalCode').notNullable();
        table.string('street').notNullable();
        table.string('number');
        table.string('district').notNullable();
        table.string('complement');
        table.string('city').notNullable();
        table.string('state', 2).notNullable();
        table.string('value').notNullable();
        table.string('dueDate').notNullable();
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('donors');
}

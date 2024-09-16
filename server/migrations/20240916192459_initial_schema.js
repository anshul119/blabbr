exports.up = function (knex) {
  return knex.schema.createTable('users', function (table) {
    table.increments('id').primary(); // 'id SERIAL PRIMARY KEY'
    table.text('username').unique().notNullable(); // 'username TEXT UNIQUE NOT NULL'
    table.text('email').unique().notNullable(); // 'email TEXT UNIQUE NOT NULL'
    table.text('password').notNullable(); // 'password TEXT NOT NULL'
    table.timestamp('created_at').defaultTo(knex.fn.now()); // 'created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('users');
};

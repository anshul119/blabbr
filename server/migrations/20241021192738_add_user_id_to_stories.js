exports.up = function (knex) {
  return knex.schema.table('stories', function (table) {
    table.integer('user_id').notNullable().references('id').inTable('users');
  });
};

exports.down = function (knex) {
  return knex.schema.table('stories', function (table) {
    table.dropColumn('user_id');
  });
};

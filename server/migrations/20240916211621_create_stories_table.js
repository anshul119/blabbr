exports.up = function (knex) {
  return knex.schema.createTable('stories', function (table) {
    table.increments('id').primary(); // Unique id (auto-increment)
    table.string('url').notNullable(); // URL to the audio file
    table.text('transcript', 'longtext').notNullable(); // Long text for transcript
    table.text('story', 'longtext').notNullable(); // Long text for story
    table.timestamp('created_at').defaultTo(knex.fn.now()); // Timestamp for record creation
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('stories'); // Drop table if rolling back
};

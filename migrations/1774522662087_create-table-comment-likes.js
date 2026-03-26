/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable('comment_likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    comment_id: { // eslint-disable-line camelcase
      type: 'VARCHAR(50)',
      notNull: true,
    },
    user_id: { // eslint-disable-line camelcase
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  // Add unique constraint to prevent duplicate likes
  pgm.addConstraint('comment_likes', 'unique_comment_user', {
    unique: ['comment_id', 'user_id'],
  });

  // Add foreign key constraint to comments
  pgm.addConstraint('comment_likes', 'fk_comment_likes.comment_id_comments.id', {
    foreignKeys: {
      columns: 'comment_id',
      references: 'comments(id)',
      onDelete: 'CASCADE',
    },
  });

  // Add foreign key constraint to users
  pgm.addConstraint('comment_likes', 'fk_comment_likes.user_id_users.id', {
    foreignKeys: {
      columns: 'user_id',
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('comment_likes');
};

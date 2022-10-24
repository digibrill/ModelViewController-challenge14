const User = require('./User');
const Devnote = require('./Devnote');

User.hasMany(Devnote, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

Devnote.belongsTo(User, {
  foreignKey: 'user_id'
});

module.exports = { User, Devnote };

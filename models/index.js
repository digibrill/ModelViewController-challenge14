const User = require('./User');
const Devnote = require('./Devnote');
const Comment = require('./Comment');

User.hasMany(Devnote, {
  foreignKey: 'user_id',
  //as: 'devnote',
  onDelete: 'CASCADE'
});
User.hasMany(Comment, {
  foreignKey: 'user_id',
  //as: 'comment',
  onDelete: 'CASCADE'
});

Devnote.hasMany(Comment, {
  foreignKey: 'post_id',
  //as: 'comment',
  onDelete: 'CASCADE'
});
Devnote.belongsTo(User, {
  foreignKey: 'id',
  //as: 'user',
  onDelete: 'CASCADE'
});

Comment.belongsTo(User, {
  foreignKey: 'id',
  //as: 'user'
});
Comment.belongsTo(Devnote, {
  foreignKey: 'id',
  //as: 'devnote'
});

module.exports = { User, Devnote, Comment };

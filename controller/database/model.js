function defineSequelizeModel (sequelize, DataTypes) { // 建立sequelize模型
  const { INTEGER, STRING, TEXT, DATE } = DataTypes

  const user = sequelize.define('user', {
    user_id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_role: {
      type: INTEGER,
      defaultValue: 1
    },
    username: {
      type: STRING(16),
      allowNull: false,
      unique: true
    },
    password: {
      type: STRING(16),
      allowNull: false
    },
    nickname:  {
      type: STRING(12),
      allowNull: false,
      unique: true
    },
    avatar: STRING(1000),
    article_collect: STRING,
    announcement_collect: STRING
  }, {
    timestamps: true
  })
  
  const association = sequelize.define('association', {
    association_id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: STRING(16),
      allowNull: false,
      unique: true
    },
    path: {
      type: STRING,
      allowNull: false,
      unique: true
    },
    avatar: STRING(1000)
  }, {
    timestamps: true
  })

  const article = sequelize.define('article', {
    article_id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: STRING(16),
      allowNull: false
    },
    avatar: STRING(1000),
    abstract: STRING(100),
    content: TEXT('long'),
  }, {
    timestamps: true
  })

  const announcement = sequelize.define('announcement', {
    announcement_id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: STRING(16),
      allowNull: false
    },
    avatar: STRING(1000),
    abstract: STRING(100),
    content: TEXT('long'),
  }, {
    timestamps: true
  })

  const comment = sequelize.define('comment', {
    comment_id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    topic_id: {
      type: INTEGER,
      allowNull: false
    },
    topic_type: {
      type: INTEGER,
      allowNull: false
    },
    content: {
      type: STRING(100),
      allowNull: false
    }
  }, {
    timestamps: true
  })

  association.hasMany(user)
  user.belongsTo(association)
  association.hasMany(article)
  article.belongsTo(association)
  association.hasMany(announcement)
  announcement.belongsTo(association)
  user.hasMany(comment)
  comment.belongsTo(user)

  return {
    user,
    association,
    article,
    announcement,
    comment
  }
}

module.exports.defineSequelizeModel = defineSequelizeModel
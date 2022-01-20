function defineSequelizeModel (sequelize, DataTypes) { // 建立sequelize模型
  const { INTEGER, STRING, TEXT } = DataTypes

  const user = sequelize.define('user', {
    user_id: {
      type: INTEGER,
      primaryKey: true
    },
    user_role: {
      type: INTEGER,
      defaultValue: 1
    },
    username: {
      type: STRING(16),
      allowNull: false
    },
    password: {
      type: STRING(16),
      allowNull: false
    },
    nickname:  {
      type: STRING(12),
      allowNull: false
    },
    avatar: STRING,
    article_collect: STRING,
    announcement_collect: STRING
  }, {
    timestamps: true
  })
  
  const association = sequelize.define('association', {
    association_id: {
      type: INTEGER,
      primaryKey: true
    },
    name: {
      type: STRING(16),
      allowNull: false
    },
    avatar: STRING,
    articles: STRING,
    announcements: STRING
  }, {
    timestamps: true
  })

  const article = sequelize.define('article', {
    article_id: {
      type: INTEGER,
      primaryKey: true
    },
    name: {
      type: STRING(16),
      allowNull: false
    },
    avatar: STRING,
    abstract: STRING(100),
    content: TEXT('long'),
    association_id: {
      type: INTEGER,
      allowNull: false,
      references: {
        model: association,
        key: 'association_id'
      }
    }
  }, {
    timestamps: true
  })

  const announcement = sequelize.define('announcement', {
    announcement_id: {
      type: INTEGER,
      primaryKey: true
    },
    name: {
      type: STRING(16),
      allowNull: false
    },
    avatar: STRING,
    abstract: STRING(100),
    content: TEXT('long'),
    association_id: {
      type: INTEGER,
      allowNull: false,
      references: {
        model: association,
        key: 'association_id'
      }
    }
  }, {
    timestamps: true
  })

  const comment = sequelize.define('comment', {
    comment_id: {
      type: INTEGER,
      primaryKey: true
    },
    user_id: {
      type: INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'user_id'
      }
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

  return {
    user,
    association,
    article,
    announcement,
    comment
  }
}

module.exports.defineSequelizeModel = defineSequelizeModel
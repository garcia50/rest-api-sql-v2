'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    emailAddress: DataTypes.STRING,
    password: DataTypes.STRING
  }, {});
  User.associate = (models) => {
    User.hasMany(models.Course, { 
      foreignKey: {
        fieldName: 'userId',
        allowNull: false
      }
    });
  };
  return User;
};
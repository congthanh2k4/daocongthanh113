const { db, generateId } = require('../db/database');

class UserModel {
  static create(data) {
    const user = {
      _id: generateId('users'),
      ...data,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    db.users.push(user);
    return user;
  }

  static findOne(query) {
    return db.users.find(user => {
      if (query.$or) {
        return query.$or.some(condition => {
          return Object.keys(condition).every(key => user[key] === condition[key]);
        });
      }
      return Object.keys(query).every(key => user[key] === query[key]);
    });
  }

  static findOneAndUpdate(query, data) {
    const user = db.users.find(user => {
      return Object.keys(query).every(key => user[key] === query[key]);
    });
    if (user) {
      Object.assign(user, data, { updatedAt: new Date() });
      return user;
    }
    return null;
  }

  static find(query = {}) {
    let results = db.users.filter(user => {
      return Object.keys(query).every(key => {
        if (key === 'isDeleted') return user[key] === query[key];
        return true;
      });
    });
    return results;
  }

  static findById(id) {
    return db.users.find(user => user._id === parseInt(id));
  }

  static findByIdAndUpdate(id, data) {
    const user = db.users.find(user => user._id === parseInt(id));
    if (user) {
      Object.assign(user, data, { updatedAt: new Date() });
      return user;
    }
    return null;
  }

  static findByIdAndDelete(id) {
    const user = db.users.find(user => user._id === parseInt(id));
    if (user) {
      user.isDeleted = true;
      user.updatedAt = new Date();
      return user;
    }
    return null;
  }
}

module.exports = UserModel;

const { db, generateId } = require('../db/database');

class RoleModel {
  static create(data) {
    const role = {
      _id: generateId('roles'),
      ...data,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    db.roles.push(role);
    return role;
  }

  static findOne(query) {
    return db.roles.find(role => {
      if (query.$or) {
        return query.$or.some(condition => {
          return Object.keys(condition).every(key => role[key] === condition[key]);
        });
      }
      return Object.keys(query).every(key => role[key] === query[key]);
    });
  }

  static find(query = {}) {
    let results = db.roles.filter(role => {
      if (query.isDeleted !== undefined && role.isDeleted !== query.isDeleted) {
        return false;
      }
      return true;
    });
    return results;
  }

  static findById(id) {
    return db.roles.find(role => role._id === parseInt(id));
  }

  static findByIdAndUpdate(id, data) {
    const role = db.roles.find(role => role._id === parseInt(id));
    if (role) {
      Object.assign(role, data, { updatedAt: new Date() });
      return role;
    }
    return null;
  }

  static findByIdAndDelete(id) {
    const role = db.roles.find(role => role._id === parseInt(id));
    if (role) {
      role.isDeleted = true;
      role.updatedAt = new Date();
      return role;
    }
    return null;
  }
}

module.exports = RoleModel;

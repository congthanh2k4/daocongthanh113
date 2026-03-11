const { db, generateId } = require('../db/database');

class CategoryModel {
  static create(data) {
    const category = {
      _id: generateId('categories'),
      ...data,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    db.categories.push(category);
    return category;
  }

  static find(query = {}) {
    let results = db.categories.filter(category => {
      if (query.isDeleted !== undefined && category.isDeleted !== query.isDeleted) {
        return false;
      }
      return true;
    });
    return results;
  }

  static findById(id) {
    return db.categories.find(category => category._id === parseInt(id));
  }

  static findByIdAndUpdate(id, data) {
    const category = db.categories.find(category => category._id === parseInt(id));
    if (category) {
      Object.assign(category, data, { updatedAt: new Date() });
      return category;
    }
    return null;
  }

  static findByIdAndDelete(id) {
    const category = db.categories.find(category => category._id === parseInt(id));
    if (category) {
      category.isDeleted = true;
      category.updatedAt = new Date();
      return category;
    }
    return null;
  }
}

module.exports = CategoryModel;

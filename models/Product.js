const { db, generateId } = require('../db/database');

class ProductModel {
  static create(data) {
    const product = {
      _id: generateId('products'),
      ...data,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    db.products.push(product);
    return product;
  }

  static find(query = {}) {
    let results = db.products.filter(product => {
      if (query.isDeleted !== undefined && product.isDeleted !== query.isDeleted) {
        return false;
      }
      if (query.title && !product.title.match(new RegExp(query.title, 'i'))) {
        return false;
      }
      if (query.price) {
        if (query.price.$gte && product.price < query.price.$gte) return false;
        if (query.price.$lte && product.price > query.price.$lte) return false;
      }
      return true;
    });
    return results;
  }

  static findById(id) {
    return db.products.find(product => product._id === parseInt(id));
  }

  static findByIdAndUpdate(id, data) {
    const product = db.products.find(product => product._id === parseInt(id));
    if (product) {
      Object.assign(product, data, { updatedAt: new Date() });
      return product;
    }
    return null;
  }

  static findByIdAndDelete(id) {
    const product = db.products.find(product => product._id === parseInt(id));
    if (product) {
      product.isDeleted = true;
      product.updatedAt = new Date();
      return product;
    }
    return null;
  }
}

module.exports = ProductModel;

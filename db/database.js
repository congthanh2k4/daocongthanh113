// In-memory database storage
const db = {
  users: [],
  products: [],
  categories: [],
  roles: []
};

let nextUserId = 1;
let nextProductId = 1;
let nextCategoryId = 1;
let nextRoleId = 1;

module.exports = {
  db,
  
  // Utility to generate IDs
  generateId: (collection) => {
    if (collection === 'users') return nextUserId++;
    if (collection === 'products') return nextProductId++;
    if (collection === 'categories') return nextCategoryId++;
    if (collection === 'roles') return nextRoleId++;
  },
  
  // Reset IDs (useful for testing)
  resetIds: () => {
    nextUserId = 1;
    nextProductId = 1;
    nextCategoryId = 1;
    nextRoleId = 1;
  }
};

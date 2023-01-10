import Estate from './Estate.js';
import Price from './Price.js';
import Category from './Category.js';
import User from './User.js';

// Price.hasOne(Estate);

Estate.belongsTo(Price, { foreignKey: 'priceId' })
Estate.belongsTo(Category, { foreignKey: 'categoryId' })
Estate.belongsTo(User, { foreignKey: 'userId' })

export { Estate, Price, Category, User };

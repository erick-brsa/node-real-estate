import Estate from './Estate.js';
import Price from './Price.js';
import Category from './Category.js';
import User from './User.js';
import Message from './Message.js';

// Price.hasOne(Estate);

Estate.belongsTo(Price, { foreignKey: 'priceId' });
Estate.belongsTo(Category, { foreignKey: 'categoryId' });
Estate.belongsTo(User, { foreignKey: 'userId' });
Estate.hasMany(Message, { foreignKey: 'estateId' });

Message.belongsTo(Estate, { foreignKey: 'estateId' });
Message.belongsTo(User, { foreignKey: 'userId' });

export { Estate, Price, Category, User, Message };

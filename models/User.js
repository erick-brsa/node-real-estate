import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import db from '../config/db.js';

const User = db.define(
	'users',
	{
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false
		},
		token: {
			type: DataTypes.STRING
		},
		confirmed: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		}
	},
	{
		hooks: {
			beforeCreate: async function (user) {
				const salt = await bcrypt.genSalt(10);
				user.password = await bcrypt.hash(user.password, salt);
			}
		},
		scopes: {
			removePassword: {
				attributes: {
					exclude: ['password', 'token', 'confirmed', 'createdAt', 'updatedAt']
				}
			}
		} 
	}
);

export default User;

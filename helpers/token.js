export const generateId = () => {
	return Date.now().toString(32) + Math.random().toString(32).substring(2);
};

export const generateJWT = (user) =>
	jwt.sign(
		{ id: user.id, name: user.name, email: user.email },
		process.env.SECRET,
		{ expiresIn: '1d' }
	);

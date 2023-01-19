import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

const protectRoute = async (req, res, next) => {
	// Verificar si hay un token
	const { _token } = req.cookies;
	if (!_token) {
		return res.redirect('/auth/login');
	}

	// Comprobar el token
    try {
        const decoded = jwt.verify(_token, process.env.SECRET);
		const user = await User.scope('removePassword').findByPk(decoded.id);
		if (!user) {
			return res.redirect('/auth/login');
		}
		req.user = user;
		return next();
    } catch (error) {
        return res.clearCookie('_token').redirect('/auth/login')
    }
};

export default protectRoute;

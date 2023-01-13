import jwt from 'jsonwebtoken';

const protectRoute = async (req, res, next) => {
	// Verificar si hay un token
	const { _token } = req.cookies;
	if (!_token) {
		return res.redirect('/auth/login');
	}

	// Comprobar el token
    try {
        
    } catch (error) {
        return res.clearCookie('_token').redirect('/auth/login')
    }

	next();
};

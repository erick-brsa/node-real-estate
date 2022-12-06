export const loginForm = (req, res) => {
	res.render('auth/login', {
		auth: false
	});
};

export const registerForm = (req, res) => {
    res.render('auth/register', {
        auth: false
    });
}
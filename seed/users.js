import bcrypt from 'bcrypt';

const users = [
    {
        name: 'Erick',
        email: 'erickalan@gmail.com',
        confirmed: 1,
        password: bcrypt.hashSync('password',10)
    }
];

export default users;
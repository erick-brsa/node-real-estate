export * from './token.js';
export * from './emails.js';

export const isSeller = (userId, estateUserId) => {
	return userId === estateUserId;
};

export const formatDate = (date) => {
	const newDate = new Date(date).toISOString().toString().slice(0, 10);
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }

    return new Date(newDate).toLocaleString('es-ES', options);
};

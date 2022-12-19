export const admin = (req, res) => {
    res.render('estate/admin'), {
        page: 'Mis propiedades',
        bar: true
    }
}

export const createProperty = (req, res) => {
    res.render('estate/create', {
        page: 'Crear propiedad',
        bar: true
    })
};

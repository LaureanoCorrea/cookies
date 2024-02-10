function auth (req, res, next) {
    if (req.session?.user.username === 'fede' && req.session.user.admin) {
        return next ()
    }
    return res.status(401).send('Error de Autenticacion')
}

export default auth
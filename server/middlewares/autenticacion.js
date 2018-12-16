const jwt = require('jsonwebtoken');

// Verificar token
let verificaToken = (req, res, next) => {
    let token = req.get('token');


    jwt.verify(token, process.env.seed_Token, (err, decode) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }
        req.usuario = decode.usuario;
        next();
    });
};

// Verificar token
let verificaRol = (req, res, next) => {
    let usuario = req.usuario;
    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {

        return res.json({
            ok: true,
            err: {
                messaje: 'No tiene rol de administrador'
            }
        });
    }
};

module.exports = {
    verificaToken,
    verificaRol
}
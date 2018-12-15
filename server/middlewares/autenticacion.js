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
        req.usuario = decode.Usuario;
        next();
    });
};

module.exports = {
    verificaToken
}
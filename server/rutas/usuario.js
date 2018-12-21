const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../modelos/usuarios');
const { verificaToken, verificaRol } = require('../middlewares/autenticacion');
const app = express();


app.get('/usuario', verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);
    let estadoUser = req.query.estadoUser || true;
    Usuario.find({ estado: estadoUser }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuario) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err

                });
            }
            Usuario.count({ estado: estadoUser }, (err, cuantos) => {

                res.json({
                    ok: true,
                    registros: cuantos,
                    usuario
                });
            })
        });
});


app.post('/usuario', [verificaToken, verificaRol], (req, res) => {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err

            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

});

app.put('/usuario/:id', [verificaToken, verificaRol], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err

            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

app.delete('/usuario/:id', [verificaToken, verificaRol], (req, res) => {
    let id = req.params.id;
    let cambiaEstado = { estado: false };
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuariodel) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err

            });
        }
        if (!usuariodel) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }

            });
        }
        res.json({
            ok: true,
            usuario: usuariodel
        });
    });
});

module.exports = app;
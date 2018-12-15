const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../modelos/usuarios');
const app = express();

app.post('/login', (req, res) => {
    let body = req.body;
    Usuario.findOne({ email: body.email }, (err, usuarioBd) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err

            });
        }
        if (!usuarioBd) {
            return res.status(400).json({
                ok: false,
                err: {
                    menssaje: '(Usuario) o contraseña incorrectos'
                }

            });
        }
        if (!bcrypt.compareSync(body.password, usuarioBd.password)) {
            return res.status(500).json({
                ok: false,
                err: {
                    menssaje: 'Usuario o (contraseña) incorrectos'
                }

            });
        }
        let token = jwt.sign({
            Usuario: usuarioBd
        }, process.env.seed_Token, { expiresIn: process.env.cad_Token })
        res.json({
            ok: true,
            Usuario: usuarioBd,
            token
        })
    });
});

module.exports = app;
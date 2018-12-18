const express = require('express');
let { verificaToken, verificaRol } = require('../middlewares/autenticacion');
let app = express();
let Categoria = require('../modelos/categoria');

module.exports = app;

//obtiene categorias
app.get('/categoria', verificaToken, (req, res) => {
    let id = req.params.id;
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categoriaDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err

                });
            }
            res.json({
                ok: true,
                categoriaDB
            });
        });

});
//obtiene categorias por id
app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err

            });
        }
        if (!categoriaDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'categoria no encontrada'
                }

            });
        }
        res.json({
            ok: true,
            categoriaDB
        });
    });

});
//Crea una categoria
app.post('/categoria', verificaToken, (req, res) => {
    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err

            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err

            });
        }
        res.json({
            ok: true,
            usuario: categoriaDB
        });
    });

});
//Actualiza categoria
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    //let body = req.body;
    let desCat = {
        descripcion: req.body.descripcion
    }
    Categoria.findByIdAndUpdate(id, desCat, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err

            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err

            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});
//Elimina fisicamente categoria
app.delete('/categoria/:id', [verificaToken, verificaRol], (req, res) => {
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, catDelete) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err

            });
        }
        if (!catDelete) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }

            });
        }
        res.json({
            ok: true,
            message: 'Categoria borrada '
        });
    })
});
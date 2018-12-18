const express = require('express');
let { verificaToken, verificaRol } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../modelos/producto');

//Crear productos
app.post('/productos', verificaToken, (req, res) => {
    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err

            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err

            });
        }
        res.json({
            ok: true,
            usuario: productoDB
        });
    });
});

//Obtener productos paginados
app.get('/productos', verificaToken, (req, res) => {
    let hasta = req.params.hasta || 10;
    hasta = Number(hasta);
    Producto.find({}).limit(hasta)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoBD) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err

                });
            }
            res.json({
                ok: true,
                productoBD
            });
        });

});

//obtener un producto por ID
app.get('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion').exec((err, productoBD) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err

                });
            }
            if (!productoBD) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'categoria no encontrada'
                    }

                });
            }
            res.json({
                ok: true,
                productoBD
            });
        });

});

//Actualiza productos
app.put('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let productoArr = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        disponible: body.disponible,
        categoria: body.categoria
    }
    Producto.findByIdAndUpdate(id, productoArr, { new: true, runValidators: true }, (err, productosDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err

            });
        }
        if (!productosDB) {
            return res.status(400).json({
                ok: false,
                err

            });
        }

        res.json({
            ok: true,
            categoria: productosDB
        });
    });
});


//Elimina registro, cambia el estado del campo "disponible"

app.delete('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Producto.findByIdAndUpdate(id, { disponible: req.body.disponible }, { new: true, runValidators: true }, (err, productosDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err

            });
        }
        if (!productosDB) {
            return res.status(400).json({
                ok: false,
                err

            });
        }

        res.json({
            ok: true,
            categoria: productosDB
        });
    });

});

app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;
    let regExp = new RegExp(termino, 'i');
    Producto.find({ nombre: regExp })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err

                });
            }
            res.json({
                ok: true,
                productos
            })
        })
});

module.exports = app;
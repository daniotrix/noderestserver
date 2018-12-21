const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../modelos/usuarios');
const Producto = require('../modelos/producto');
const fs = require('fs');
const path = require('path');

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {
    let tipo = req.params.tipo;
    let id = req.params.id;

    if (Object.keys(req.files).length == 0) {
        return res.status(400).json({
            ok: false,
            err: {
                messaje: 'No se ha seleccionado ningun archivo'
            }
        });
    }

    let tiposValidos = ['productos', 'usuarios']

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                messaje: 'tipo no permitida, solo se aceptan ' + tiposValidos.join(', ')
            }
        });

    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let archivo = req.files.archivo;
    let nombreSplit = archivo.name.split('.');
    let extencionArchivo = nombreSplit[nombreSplit.length - 1];

    let extencionesValidas = ['png', 'jpg'];
    if (extencionesValidas.indexOf(extencionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                messaje: 'extencion no permitida, solo se aceptan ' + extencionesValidas.join(', '),
                extencion: extencionArchivo
            }
        });

    }

    //renombrar archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extencionArchivo}`


    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        //imagen se cargo

        if (tipo === 'usuarios') {
            imgUser(id, res, nombreArchivo);

        } else {
            imgProd(id, res, nombreArchivo);
        }
    });
});

function imgUser(id, res, nombreArchivo) {
    Usuario.findById(id, (err, udb) => {
        if (err) {
            delArch(nombreArchivo, 'usuarios', );
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!udb) {
            delArch(nombreArchivo, 'usuarios', );
            return res.status(400).json({
                ok: true,
                err: {
                    messaje: 'usuario no existe'
                }
            });
        }



        delArch(udb.img, 'usuarios', );


        udb.img = nombreArchivo;
        udb.save((err, udbGuardado) => {
            res.json({
                ok: true,
                usuario: udbGuardado,
                img: nombreArchivo
            })
        });

    });
}

function imgProd(id, res, nombreArchivo) {
    Producto.findById(id, (err, pdb) => {
        if (err) {
            delArch(nombreArchivo, 'productos', );
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!pdb) {
            delArch(nombreArchivo, 'productos', );
            return res.status(400).json({
                ok: true,
                err: {
                    messaje: 'usuario no existe'
                }
            });
        }



        delArch(pdb.img, 'productos', );


        pdb.img = nombreArchivo;
        pdb.save((err, pdbGuardado) => {
            res.json({
                ok: true,
                producto: pdbGuardado,
                img: nombreArchivo
            })
        });

    });
}

function delArch(nombreImg, tipo, ) {
    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImg}`);
    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg);
    }
}

module.exports = app;
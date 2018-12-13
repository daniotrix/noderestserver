require('./config/config')
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(require('./rutas/usuario'));

mongoose.connect(process.env.cadenaDB, { useNewUrlParser: true }, (err, res) => {

    if (err) throw err;

    console.log('Base de Datos ONLINE');

});
// mongoose.connect(process.env.cadenaDB, { useNewUrlParser: true }, (error) => {
//     if (error) throw error;
//     console.log('Base de datos online');
// });

app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto: ', 3000);
})
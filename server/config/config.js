process.env.PORT = process.env.PORT || 3000;

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let uriDB;
if (process.env.NODE_ENV === 'dev') {
    uriDB = 'mongodb://localhost:27017/testdb';
} else {
    uriDB = 'mongodb://usuariouno:qwe123@ds025762.mlab.com:25762/testbd';
}

process.env.cadenaDB = uriDB;
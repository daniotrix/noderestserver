process.env.PORT = process.env.PORT || 3000;

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let uriDB;
if (process.env.NODE_ENV === 'dev') {
    uriDB = 'mongodb://localhost:27017/testdb';
} else {
    uriDB = process.env.MONGO_URIDB;
}

process.env.cadenaDB = uriDB;
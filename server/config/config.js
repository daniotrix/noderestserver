process.env.PORT = process.env.PORT || 3000;

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let uriDB;
if (process.env.NODE_ENV === 'dev') {
    uriDB = 'mongodb://localhost:27017/testdb';
} else {
    uriDB = process.env.MONGO_URIDB;
}

process.env.cadenaDB = uriDB;

//SEED Token

//Vencimiento Token
process.env.cad_Token = '48h';
process.env.seed_Token = process.env.seed_Token || 'secret';

//google client id
process.env.CLIENT_ID = process.env.CLIENT_ID || '999087319266-8evs36v0av19u4dmrmmpqa6r20ormt1s.apps.googleusercontent.com';
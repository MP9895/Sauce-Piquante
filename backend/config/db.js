const db = require('mongoose');
const dotEnv = require('dotenv'); // DotEnv, module used for Db password, username ... 

//Create connexion to Mongodb Database

const dbConnect = () => {
    dotEnv.config() // invoking the dotenv config here

    const uri = process.env.DB_URI;

    db.connect(uri, {
        dbName: process.env.DB_NAME,
        user: process.env.DB_USER,
        pass: process.env.DB_PASS,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(() => console.log('Connexion à MongoDb réussie !'))
        .catch((error => console.log('Connexion à mongoBD échouée ! ' + error.message)));
}

//export
module.exports = dbConnect;
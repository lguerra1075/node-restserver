


process.env.PORT = process.env.PORT || 3000;

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';



process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;
process.env.SEED = process.env.SEED || 'seed-desarrollo'



let urlDB;

if(process.env.NODE_ENV === 'dev'){
    urlDB= "mongodb://localhost:27017/cafe";
}else{
    urlDB= process.env.MONGO_URI;
}

process.env.URLDB = urlDB;



process.env.CLIENT_ID = process.env.CLIENT_ID || '652786849160-09r8719cplbago2dju7b5m3ee4b7hqj7.apps.googleusercontent.com'; 
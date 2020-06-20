


process.env.PORT = process.env.PORT || 3000;

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let urlDB;

if(process.env.NODE_ENV === 'dev'){
    urlDB= "mongodb://localhost:27017/cafe";
}else{
    urlDB= "mongodb+srv://udemy:MNl65w1Aq9xfytfl@cluster0-md40a.mongodb.net/cafe"
}

process.env.URLDB = urlDB;
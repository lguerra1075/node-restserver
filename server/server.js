require('./config/config');
const express = require('express')
const mongoose = require('mongoose');
const path= require('path');

const app = express()
const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.use( require('./routes/index'));

//habilitar la carpeta publica

app.use( express.static(path.resolve(__dirname, '../public')));

mongoose.connect(process.env.URLDB, 
    {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true},
    (err, res) =>{
    if( err ) throw err;
    console.log(`BD OK ${process.env.URLDB}`);
});




app.listen(process.env.PORT, ()=>{
    console.log("Escuchando el puerto 3000");
})
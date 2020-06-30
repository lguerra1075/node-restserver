const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const fs = require('fs');
const path = require('path');


let Usuario = require('../models/usuario');
let Producto = require('../models/producto');


// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {
    
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err:{
                message: `No se ha seleccionado ningun archivo`
            }
        });
    }

    //Validar tipo
    let tipo = req.params.tipo;
    let id = req.params.id;
    let tiposValidos = ['productos', 'usuarios'];
    if(tiposValidos.indexOf(tipo) < 0){
        return res.status(400).json({
            ok:false,
            err:{
                message:`Los tipos permitidos son ${tiposValidos.join(',')}`
            }
        });
    }
    let archivo = req.files.archivo;

    //Extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    let nombreArchivo = archivo.name.split('.');

    let extension = nombreArchivo[nombreArchivo.length-1]
    console.log(`${extension}`);

    if(extensionesValidas.indexOf(extension) < 0){
        return res.status(400).json({
            ok:false,
            err:{
                message:`Las extensiones permitidas son ${extensionesValidas.join(',')}`
            }
        });
    }

    //cambiar nombre archivo
    let nombreArchivoNew = `${ id }-${ new Date().getMilliseconds() }.${extension}`;

    archivo.mv(`uploads/${tipo}/${nombreArchivoNew}`, (err) => {
        if (err){
            return res.status(500).json({
                ok:false,
                err
            });
        }     
        if(tipo === 'usuarios'){
            imagenUsuario(id, res, nombreArchivoNew);
        }else{
            imagenProducto(id, res, nombreArchivoNew);
        }
        
      });
});

function imagenProducto(id, res, nombreArchivo){
    Producto.findById(id, (err, productoDB) =>{
        if(err){
            borraArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok:false,
                err
            });
        }

        if(!productoDB){
            borraArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok:false,
                err:{
                    message:`El producto no existe`
                }
            });
        }


        borraArchivo(productoDB.img, 'productos')

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardadoDB) =>{
            res.json({
                ok:true,
                producto: productoGuardadoDB,
                img: nombreArchivo
            });
        });

        

    });
}

function imagenUsuario(id, res, nombreArchivo){
    Usuario.findById(id, (err, usuarioDB) =>{
        if(err){
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok:false,
                err
            });
        }

        if(!usuarioDB){
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok:false,
                err:{
                    message:`El usuario no existe`
                }
            });
        }


        borraArchivo(usuarioDB.img, 'usuarios')

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardadoDB) =>{
            res.json({
                ok:true,
                usuario: usuarioGuardadoDB,
                img: nombreArchivo
            });
        });

        

    });
}


function borraArchivo(nombreImagen, tipo){
    let pathImagen = path.resolve( __dirname, `../../uploads/${tipo}/${ nombreImagen }`);
        if( fs.existsSync(pathImagen)){
            fs.unlinkSync(pathImagen);
        }
}
module.exports = app;
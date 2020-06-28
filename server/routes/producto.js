const express = require('express');
const _ = require('underscore');

const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

let app = express();

let Producto = require('../models/producto');
const { replaceOne } = require('../models/producto');


app.get('/producto', verificaToken, (req, res) =>{

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limit = req.query.limite || 5;
    limit = Number(limit);

    //Todas las productos
    Producto.find({})
    .skip(desde)
    .limit(limit)
    .sort('nombre')
    .populate('usuario', 'nombre email')
    .populate('categoria', 'descripcion')
    .exec((err, productos) =>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        Producto.count({}, (err, conteo) =>{
            res.json({
                ok: true,
                productos,
                conteo
            })
        })        
    })
});

app.get('/producto/buscar/:termino', verificaToken, (req, res) =>{

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');
    Producto.find({nombre: regex})
       .populate('categoria', 'descripcion')
       .exec( (err, productosDB) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            productosDB
        })
    });
});

app.get('/producto/:id', verificaToken, (req, res) =>{

    let id = req.params.id;
    //por id productos
    //producto.findById
    Producto.findById(id)
    .populate('usuario', 'nombre email')
    .populate('categoria', 'descripcion')    
    .exec( (err, productoDB) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(!productoDB){
            return res.status(400).json({
                ok: false,
                err:{
                    message: `La producto con el id ${id} no existe`
                }
            });
        }

        res.json({
            ok: true,
            productoDB
        })
    });
    
});

app.post('/producto', verificaToken, function (req, res) {
  
    let body = req.body;
    
    let producto = new Producto({                
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: true,
        categoria: body.categoria_id,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) =>{
        if(err){
          return res.status(500).json({
              ok: false,
              err
          });
        }
        
        if(!productoDB){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            producto: productoDB
        })
    });
  })

  app.put('/producto/:id', [verificaToken], function (req, res) {
  
    let id = req.params.id;

    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'disponible']);
    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) =>{
      if(err){
          return res.status(400).json({
              ok: false,
              err
          });
      }

      return res.json({
          ok: true,
          producto: productoDB
      })

    });
    
  })

  app.delete('/producto/:id', [verificaToken, verificaAdminRole], function (req, res) {
        
    let id = req.params.id;
    let cambiaDisponibilidad = {
        disponible: false
    };
    Producto.findByIdAndUpdate(id, cambiaDisponibilidad, (err, productoDB) =>{
      if(err){
          return res.status(400).json({
              ok: false,
              err
          });
      }

      if(!productoDB){
        return res.status(400).json({
            ok: false,
            err:{
                message: `El producto con el ${id} no existe`
            }
        });
    }

      return res.json({
          ok: true,
          message: `producto deshabilitado`
      })

    });

  });


module.exports = app;
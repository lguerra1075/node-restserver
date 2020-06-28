const express = require('express');
const _ = require('underscore');

const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');
const { replaceOne } = require('../models/categoria');


app.get('/categoria', verificaToken, (req, res) =>{
    //Todas las categorias
    Categoria.find()
    .sort('descripcion')
    .populate('usuario', 'nombre email')
    .exec((err, categorias) =>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categorias
        })
    })
});


app.get('/categoria/:id', (req, res) =>{

    let id = req.params.id;
    //por id categorias
    //categoria.findById
    Categoria.findById(id)    
    .exec( (err, categoriaDB) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err:{
                    message: `La categoria con el id ${id} no existe`
                }
            });
        }

        res.json({
            ok: true,
            categoriaDB
        })
    });
    
});

app.post('/categoria', verificaToken, function (req, res) {
  
    let body = req.body;
    
    let categoria = new Categoria({        
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) =>{
        if(err){
          return res.status(500).json({
              ok: false,
              err
          });
        }
        
        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            categoria: categoriaDB
        })
    });
  })

  app.put('/categoria/:id', [verificaToken], function (req, res) {
  
    let id = req.params.id;

    let body = _.pick(req.body, ['descripcion']);
    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) =>{
      if(err){
          return res.status(400).json({
              ok: false,
              err
          });
      }

      return res.json({
          ok: true,
          categoria: categoriaDB
      })

    });
    
  })

  app.delete('/categoria/:id', [verificaToken, verificaAdminRole], function (req, res) {
        
    let id = req.params.id;
    
    Categoria.findByIdAndRemove(id, (err, categoriaDB) =>{
      if(err){
          return res.status(400).json({
              ok: false,
              err
          });
      }

      if(!categoriaDB){
        return res.status(400).json({
            ok: false,
            err:{
                message: `El ${id} no existe`
            }
        });
    }

      return res.json({
          ok: true,
          message: `categoria borrada`
      })

    });

  })
module.exports = app;
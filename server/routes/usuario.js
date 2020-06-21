
const express = require('express')

const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');
const { json } = require('body-parser');
const app = express()

  app.get('/usuario/:estado', verificaToken ,(req, res) => {

    // return res.json({
    //     usuario: req.usuario,
    //     nombre: req.usuario.nombre,
    //     email: req.usuario.email
    // });
    let estado = req.params.estado;
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limit = req.query.limite || 5;
    limit = Number(limit);
    Usuario.find({estado}, 'nombre email role estado google img')
    .skip(desde)
    .limit(limit)
    .exec( (err, usuarios) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        Usuario.count({estado}, (err, conteo) =>{
            res.json({
                ok: true,
                usuarios,
                conteo
            })
        })
       
    })    
  })
   
  app.post('/usuario', [verificaToken, verificaAdminRole], function (req, res) {
  
      let body = req.body;
      
      let usuario = new Usuario({
          nombre: body.nombre,
          email: body.email,
          password: bcrypt.hashSync(body.password, 10),
          role: body.role,
      });

      usuario.save((err, usuarioDB) =>{
          if(err){
            return res.status(400).json({
                ok: false,
                err
            });
          }
          
          return res.json({
              ok: true,
              usuario: usuarioDB
          })
      });
    })
  
    app.put('/usuario/:id', [verificaToken, verificaAdminRole], function (req, res) {
  
      let id = req.params.id;

      let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
      Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) =>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            usuario: usuarioDB
        })

      });
      
    })
  
    app.delete('/usuario/:id', verificaToken, function (req, res) {
        
      let id = req.params.id;
      let cambiaEstado = {
          estado: false
      };
      Usuario.findByIdAndUpdate(id, cambiaEstado, (err, usuarioDB) =>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            usuario: usuarioDB
        })

      });

    })
  
    module.exports = app;
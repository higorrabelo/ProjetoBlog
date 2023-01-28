const express = require('express');
const router = express.Router();
const User = require('./User.js');
const crypto = require('crypto')
router
      .get("/admin/users",(req,resp)=>{
            User.findAll().then((users)=>{
                  resp.render("admin/users/index",{users:users})
            })
      })
      .get("/admin/users/:id",(req,resp)=>{
            var id = req.params.id;
            User.findAll({where:{id:id}}).then((users)=>{
                  resp.render("admin/users/index",{users:users})
            })
      })
      .get("/admin/users/create",(req,resp)=>{
            resp.render("admin/users/create")
      })
      .get("/admin/users/edit/:id",(req,resp)=>{
            var id = req.params.id;
            User.findOne({where:{id:id}}).then((user)=>{
                  resp.render("admin/users/edit",{user:user})
            }).catch(erro=>{
                  resp.send("Erro ao encontrar usuário")
            })
            
      })
      .post("/admin/users/create",(req,resp)=>{
            var email = req.body.email;
            var senha = req.body.senha;

            User.findOne({where:{
                  email:email
            }}).then((user)=>{
                  if(user==undefined){
                        User.create({
                              email:email,
                              password:crypto.createHash('MD5').update(senha).digest('hex'),
                        }).then(()=>{
                              resp.redirect("/admin/users");
                        }).catch((erro)=>{
                              resp.send("Erro\n"+erro)
                        })
                  }else{
                      resp.redirect("/admin/users/create"); 
                  }
            })
      })
      .post("/admin/users/delete",(req,resp)=>{
            var id = req.body.id;
            User.destroy({where:{id:id}}).then(()=>{
                  resp.redirect("/admin/users")
            }).catch((erro)=>{
                  resp.send("Erro de exclusão\n"+erro)
            })      

      })
      .post("/admin/users/edit",(req,resp)=>{
            var id = req.body.id;
            var email = req.body.email;
            var senha = req.body.senha;
            User.update({
                  email:email,
                  password:crypto.createHash('MD5').update(senha).digest('hex')
            },{where:{id:id}}).then(()=>{
                  resp.redirect("/admin/users")
            }).catch((erro)=>{
                  resp.send(erro)
            })
      })
     
      

module.exports = router;
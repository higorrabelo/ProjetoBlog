const session = require('express-session');
const crypto = require('crypto')
const CategoriesController = require('../categories/CategoriesController.js'),
      express = require('express');
const User = require('../users/User.js');
      ArticlesController = require('../articles/ArticlesController.js'),
      Article = require('../articles/Article.js'),
      Category = require('../categories/Category.js'),
      UserController = require('../users/UserController.js');
      

const routes = (app)=>{

    //Sessions
    app.use(session({
        secret:"chavedeseguranca",
        cookie:{
            maxAge: 3000000
        }
    }))

    app.get("/login",(req,resp)=>{
        resp.render("admin/users/login")
    })
    app.post("/login",(req,resp)=>{
        var email = req.body.email;
        var password = req.body.senha;
        User.findOne({where:{
            email:email,
            password: crypto.createHash('MD5').update(password).digest('hex')
        }}).then((user)=>{      
            if(user==undefined){
                resp.redirect("/login")
            }else{
                req.session.user ={
                    id: user.id,
                    email: user.email
                }
                //resp.json(req.session.user)
                resp.redirect("/admin/articles")
            }

        })
    })

    app.get("/logout",(req,resp)=>{
        req.session.user = undefined;
        resp.redirect("/login")
    })

    app.route('/').get((req,resp)=>{
        Article.findAll({
            order:[
                ['id','DESC']
            ],
            limit:4
        }).then(articles =>{
            Category.findAll().then(categories=>{
                resp.render("index",{articles:articles,categories:categories});
            })     
        })
        
    })
    

    
    app.use(
        CategoriesController,
        ArticlesController,
        UserController,
    );
}

module.exports = routes;
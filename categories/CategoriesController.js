const express = require('express');
const router = express.Router();
const Category = require('./Category.js')
const slugify = require('slugify')
const Article = require('../articles/Article.js')
const adminAuth = require('../middlewares/adminAuth.js');
router
      .get("/admin/categories/new",adminAuth,(req,resp)=>{
            resp.render("admin/categories/new")
      })
      .get("/admin/categories",adminAuth,(req,resp)=>{
            Category.findAll().then(categories=>{
                  resp.render("admin/categories/index",{categories:categories});
            });
      })
      .get("/category/:slug",(req,resp)=>{
            var slug = req.params.slug;
            Category.findOne({
                  where:{
                        slug:slug
                  },
                  include:[{model: Article}]
            }).then((category)=>{
                  if(category!=undefined){
                        Category.findAll().then(categories=>{
                           resp.render("index",{articles:category.articles,categories:categories });   
                        })
                  }else{
                        resp.redirect("/")
                  }
            }).catch(()=>{
                  resp.redirect("/")
            })
      })
      .post("/categories/save",(req,resp)=>{
            var title = req.body.title;
            if(title!=undefined){
                  Category.create({
                        title:title,
                        slug:slugify(title)
                  }).then(()=>{
                        resp.redirect("/admin/categories");
                  })
            }else{
                  resp.redirect("admin/categories/new");
            }
      })
      .post("/categories/delete",(req,resp)=>{
            var id = req.body.id;
            if(id!=undefined){
                  if(!isNaN(id)){
                        Category.destroy({
                              where:{
                                    id:id
                              }
                        }).then(()=>{
                              resp.redirect("/admin/categories")
                        });
                  }else{
                        resp.redirect("/admin/categories");
                  }
            }else{
                  resp.redirect("/admin/categories");
            }
      })
      .get("/admin/categories/edit/:id",adminAuth,(req,resp)=>{
            var id = req.params.id;
            
            if(isNaN(id)){
                  resp.redirect("/admin/categories");
            }
            Category.findByPk(id).then((category)=>{
                  if(category != undefined){
                        resp.render("admin/categories/edit",{category:category})
                  }else{
                        resp.redirect("/admin/categories")
                  }
            }).catch((erro)=>{
                  resp.redirect("/admin/categories")
            })
      })
      .post("/categories/update",(req,resp)=>{
            var id = req.body.id;
            var title = req.body.title;
            Category.update({
                  title:title,
                  slug:slugify(title)
            },{
                  where:{
                        id:id
                  }
            }).then(()=>{
                  resp.redirect('/admin/categories')
            })
      })



module.exports = router;
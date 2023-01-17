const express = require('express');
const router = express.Router();
const Category = require('../categories/Category.js');
const Article = require('../articles/Article.js');
const slugify = require('slugify')

router
      .get("/admin/articles",(req,resp)=>{

            Articles.findAll({
                  include:[{model:Category}]
            }).then((articles=>{
                  resp.render("admin/articles/index",{articles:articles});
            }))
    
      })
      .get("/admin/articles/new",(req,resp)=>{
            var category = Category.findAll().then((category)=>{
                  resp.render("admin/articles/new",{category:category})
            });    
      })
      .post("/article/save",(req,resp)=>{
            var title = req.body.title;
            var body = req.body.body;
            var category = req.body.selection;
            Article.create({
                  title:title,
                  slug:slugify(title),
                  body:body,
                  categoryId:category
            }).then(()=>{
                  resp.redirect("/admin/articles")
            })
      })
      .post("/articles/delete",(req,resp)=>{
            var id = req.body.id;
            if(id!=undefined){
                  if(!isNaN(id)){
                        Article.destroy({
                              where:{
                                    id:id
                              }
                        }).then(()=>{
                              resp.redirect("/admin/articles")
                        })
                  }else{
                        resp.redirect("/admin/articles")
                  }
            }else{
                  resp.redirect("/admin/articles")
            }
      });

module.exports = router;
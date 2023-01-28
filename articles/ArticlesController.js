const express = require('express');
const router = express.Router();
const Category = require('../categories/Category.js');
const Article = require('../articles/Article.js');
const slugify = require('slugify');
const adminAuth = require('../middlewares/adminAuth.js');

router
      .get("/admin/articles",adminAuth,(req,resp)=>{

            Articles.findAll({
                  include:[{model:Category}]
            }).then((articles=>{
                  resp.render("admin/articles/index",{articles:articles});
            }))
    
      })
      .get("/admin/articles/new",adminAuth,(req,resp)=>{
                  Category.findAll().then((category)=>{
                  resp.render("admin/articles/new",{category:category})
            });    
      })
      .get("/:slug",(req,resp)=>{
            var slug = req.params.slug;
            Article.findOne({
                  where:{
                        slug:slug
                  }
            }).then((article)=>{
                  if(article!=undefined){
                        Category.findAll().then(categories=>{
                            resp.render("articles",{article:article,categories:categories});
                        })     
                  }else{
                        resp.redirect("/")
                  }
            }).catch((erro)=>{
                  resp.redirect("/")
            })
      })

      .get("/admin/articles/edit/:id",adminAuth,(req,resp)=>{
            var id = req.params.id;
            Article.findOne({where:{id:id}}).then((article)=>{
                  if(article){
                    Category.findAll().then((categories=>{
                        resp.render("admin/articles/edit",{article:article,categories:categories})
                    })).catch(()=>{
                        resp.redirect("/")  
                    })
                  }else{
                    resp.redirect("/")  
                  }
            }).catch(()=>{
                    resp.redirect("/")
            })
            
       })
       .post("/admin/articles/edit",adminAuth,(req,resp)=>{
            var id = req.body.id;
            var title = req.body.title;
            var body = req.body.body;
            var category = req.body.selection;
            Article.update({
                  title:title,
                  slug:slugify(title),
                  body:body,
                  categoryId:category
            },{where:{id:id}}).then(()=>{
                  resp.redirect("/admin/articles/");
            }).catch(()=>{
                  resp.redirect("/")
            })
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
      })
      .get("/articles/page/:page",(req,resp)=>{
           var page = req.params.page;
           var offset = 0 ;
           if(isNaN(page) || page == 1){
                  offset=0;
           }else{
                  offset = (parseInt(page)-1) * 5; 
           }
           Article.findAndCountAll({
                  limit:5,
                  offset:offset,
                  order:[
                        ['id','DESC']
                  ]
           }).then((articles)=>{
                  var next;
                  if(offset + 5 >= articles.count){
                        next=false;
                  }else{
                        next=true;
                  }
                  var result={
                        page: parseInt(page),
                        next:next,
                        articles:articles
                  }

                  Category.findAll().then((categories)=>{
                        resp.render("admin/articles/page",{result:result,categories:categories})
                  })
           })
      })
      
      

module.exports = router;
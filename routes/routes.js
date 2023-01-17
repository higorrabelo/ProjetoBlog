const CategoriesController = require('../categories/CategoriesController.js'),
      ArticlesController = require('../articles/ArticlesController.js'),
      Article = require('../articles/Article.js'),
      Category = require('../categories/Category.js');
      

const routes = (app)=>{
    app.route('/').get((req,resp)=>{
        Article.findAll().then(articles =>{
            resp.render("index",{articles:articles});
        })
        
    });
    app.use(
        CategoriesController,
        ArticlesController
        );
}

module.exports = routes;
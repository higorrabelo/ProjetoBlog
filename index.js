const Category = require('./categories/Category.js');

const   express = require('express'),
        app = express(),
        session = require('express-session'),
        bodyParser = require('body-parser'),
        connection =  require('./database/database.js');
        routes = require('./routes/routes.js'),
        Categories = require('./categories/Category.js'),
        Articles = require('./articles/Article.js');
        
   
connection.authenticate()
          .then(()=>{console.log("Conectado com sucesso")})
          .catch((erro)=>{console.log("Falha na Conexão "+erro)});

   

app.use(express.static("public"))
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

routes(app);

app.listen(3000,()=>{console.log("App Rodando")})

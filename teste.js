const articles = require('./articles/Article.js');

const artigo = new articles({
    title:"Como Revolucionar o Mundo",
    slug:"Revolução",
    body:`mil coisas acontecendo por aqui nesse texto`
});

artigo.save((err)=>{
    if(err){
        console.log("Erro")
    }else{
        console.log("Salvo com sucesso")
    }
});
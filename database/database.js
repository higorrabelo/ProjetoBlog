const Sequelize = require("sequelize");
const connection = new Sequelize("aulapress","root","Higor120783",{
    host:'localhost',
    dialect:'mysql',
    timezone:"-03:00"
});

module.exports = connection;
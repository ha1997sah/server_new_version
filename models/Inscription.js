
  const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes)=>
{const Inscription=sequelize.define('Inscription',{
    catId: DataTypes.STRING


})

    
return Inscription 

}    
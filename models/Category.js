const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes)=>
{const Category=sequelize.define('Category',{
    nameCat:DataTypes.STRING,
    weight:DataTypes.STRING,
    type:DataTypes.STRING,
    sexe:DataTypes.STRING,
    age:DataTypes.STRING,
})
    Category.associate = models=>{
        Category.belongsToMany(models.Event,{ 
            through: 'Event_Category' ,
            onDelete:"cascade"
   
    })}
    
    
return Category 

}   
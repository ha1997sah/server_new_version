const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes)=>
{const Category=sequelize.define('Category',{
    nameCat:DataTypes.STRING,
    weight:DataTypes.STRING,
    type:DataTypes.STRING,
    sexe:DataTypes.STRING,
    age:DataTypes.STRING,
    start:{
        type:Sequelize.DATE
    },
    end:{
        type:Sequelize.DATE
    },

})
    Category.associate = models=>{
        Category.belongsToMany(models.Event,{ 
            through: 'Event_Category' ,
            foreignKey: "Category_id", otherKey: "Event_id",
            onDelete:"cascade"
   
    })}
    
    
return Category 

}   
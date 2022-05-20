const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes)=>
{const Federation=sequelize.define('Federation',{
    name:DataTypes.STRING,
    country:DataTypes.STRING,
    adress:DataTypes.STRING,
    managerfullName:DataTypes.STRING,
    phone:DataTypes.STRING,
    email:DataTypes.STRING
   })
   Federation.associate = models =>{
    Federation.hasMany(models.Club,{
     onDelete:"cascade"
}),
Federation.hasMany(models.User,{
    onDelete:"cascade"
})
}


return Federation

}
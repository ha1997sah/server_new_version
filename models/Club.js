const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes)=>
{const Club=sequelize.define('Club',{
    name:DataTypes.STRING,
    country:DataTypes.STRING,
    adress:DataTypes.STRING,
    managerfullName:DataTypes.STRING,
    phone:DataTypes.STRING,
    email:DataTypes.STRING,
    
   })
Club.associate = models =>{
 Club.hasMany(models.User,{
     onDelete:"cascade"
}),
Club.belongsTo(models.Federation,{
    onDelete:"cascade"
})
} 

return Club

}
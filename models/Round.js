const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes)=>
{const Round=sequelize.define('Round',{
    
    name:DataTypes.STRING,
    nb_matches:DataTypes.STRING,
    nb_players:DataTypes.STRING,
    roundIndex:DataTypes.STRING

   })

   Round.associate = models=>{
    Round.belongsTo(models.Category,{
        onDelete:"cascade"
    }),
    Round.hasMany(models.Match,{
        onDelete:"cascade"
   })

}
return Round

}

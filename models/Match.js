const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes)=>
{const Match=sequelize.define('Match',{
    
    palyer1_score:DataTypes.STRING,
    player2_score:DataTypes.STRING,
    player1:DataTypes.STRING,
    player2:DataTypes.STRING,
    matchIndex:DataTypes.STRING,
    nextMatch:DataTypes.STRING,
   })


   Match.associate = models=>{
    Match.belongsTo(models.Round,{
        onDelete:"cascade"
    })
   }
return Match

}
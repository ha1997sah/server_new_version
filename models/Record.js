const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes)=>
{const Record=sequelize.define('Record',{
    title:DataTypes.STRING,
    recordDate:{
        type: Sequelize.DATE,
      },

   })
   Record.associate = models =>{
    Record.belongsTo(models.User,{
     onDelete:"cascade"
})
}



return Record

} 
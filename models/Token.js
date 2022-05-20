const Sequelize = require("sequelize");

module.exports= (sequelize, DataTypes)=>
 Token = sequelize.define('Token',{
        user_id:{
            type:DataTypes.STRING,
            unique:true
        },
        token:{
            type:DataTypes.STRING,
            required:true,
            
        },
        tokenExpires : {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
    },
    { timestamps : true });
    
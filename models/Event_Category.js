
  const Sequelize = require("sequelize");
  module.exports = (sequelize, DataTypes)=>
  {const Event_Category=sequelize.define('Event_Category',{
    categoryDate:{
        type:Sequelize.DATE
    },
  
  
  })
  
      
  return Event_Category 
  
  }    
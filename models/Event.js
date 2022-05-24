const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes)=>
{const Event=sequelize.define('Event',{
    name:DataTypes.STRING,
    start:{
        type:Sequelize.DATE
    },
    end:{
        type:Sequelize.DATE
    },
    deadline:{
        type:Sequelize.DATE
    },
    
    location:DataTypes.STRING,
    description:DataTypes.STRING,
    image:DataTypes.STRING

})

Event.associate = models=>{
    Event.belongsToMany(models.Category,{ 
        through: 'Event_Category' ,
        onDelete:"cascade"
 
}),
Event.belongsToMany(models.User,{
    through: 'Inscription' , 
onDelete:"cascade"

})
}
return Event

}
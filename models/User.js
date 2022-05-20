const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes)=>
{const User=sequelize.define('User',{
    name:DataTypes.STRING,
    lastname:DataTypes.STRING,
    phone:DataTypes.STRING,
    role:DataTypes.STRING,
    image:DataTypes.STRING,
    weight:DataTypes.STRING,
    height:DataTypes.STRING,
    belt:DataTypes.STRING,
    medicalCertificate:DataTypes.STRING,
    level:DataTypes.STRING,
    sexe:DataTypes.STRING,
    matricule:DataTypes.STRING,
    seed:DataTypes.STRING,
    birthDate:{
        type: Sequelize.DATE,
      },
 
    email:{
        type:DataTypes.STRING,
        unique:true
    },
    isAccountActive:{
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    password:DataTypes.STRING
})

User.associate = models=>{
    User.belongsToMany(models.Event,{
        through: 'Inscription' ,
    onDelete:"cascade"

})}


User.associate = models=>{
    User.belongsTo(models.Federation,{
        onDelete:"cascade"
    })
    User.belongsTo(models.Club,{
        onDelete:"cascade"
    })
    User.hasMany(models.Record,{
        onDelete:"cascade" 
    })
}



return User

}
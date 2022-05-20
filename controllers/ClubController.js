const fetch = require('node-fetch')
const {Club,User} = require('../models')
const config2 = require('../config2/config')
const config = require('../config/config')

module.exports = {
  // create competiton 
  async createClub (req, res) {
    try {
    const club = await Club.create({
        name:req.body.name,
        managerfullName:req.body.managerfullName,
        adress:req.body.adress,
        phone:req.body.phone,
        email:req.body.email,
        country:req.body.country,
        FederationId:req.body.FederationId
      }) 
      const clubJson = club.toJSON()
      res.send({
        club: clubJson,
      })
      }catch (error) {
        res.status(400).send({
          error: error.message
        })
      }
  },

  async findClubById(req,res) {
    const club = await Club.findOne({where: {id:req.params.id}})
    if (club) {
 
      return res.status(200).send({club: club.toJSON()})
    }
    else return res.status(404).send("club not found")
  },
  async allClubs(req,res) {
    const clubs = await Club.findAll()
    res.status(200).send({clubs})
  },
  async deleteclub(req,res) {
    await Club.destroy({
      where: {
        id: req.params.id
      }
    })   
    res.send("club a été supprimé")
  },
   // update club
 
  async editClub(req,res) {
    const club = await Club.findOne({where:{id:req.params.id}})
     if(club) {
         await club.update({
          name:req.body.name,
          managerfullName:req.body.managerfullName,
          adress:req.body.adress,
          phone:req.body.phone,
          email:req.body.email,
          country:req.body.country,
          ClubId:req.body.ClubId,
          FederationId:req.body.FederationId 
       },
       {
         where: {id: req.params.id}
       })
       res.send("club updated")
     } else {
     res.send("club n'exist pas")
   }
 },

 async usersUnderClub(req,res){
  const users = await User.findAll({where: {ClubId:req.body.ClubId,role:"athlete"}})
  if (users) {
 
    return res.status(200).send({users})
  }
  else return res.status(404).send("federation not found")
},
async uniqueEmail(req,res) {
  const { email } = req.body;
  const exist = await Club.findOne({where: {
    email: email
  }});
  if (exist) {
    return res.status(200).send('email exist');}
  else
  { return res.status(404).send('email doesn eists');
}
},
  }


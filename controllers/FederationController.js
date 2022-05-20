const fetch = require('node-fetch')
const config2 = require('../config2/config')
const config = require('../config/config')
const { sendConfirmationEmail, sendResetPasswordEmail,sendAcceptationEmail,sendRefuseEmail } = require('../mailer');
const {Federation,Club,User} = require('../models');

module.exports = {
  // create fed 
  async createFederation (req, res) {
    try {
    const fed = await Federation.create({
      name:req.body.name,
      managerfullName:req.body.managerfullName,
      adress:req.body.adress,
      phone:req.body.phone,
      email:req.body.email, 
      country:req.body.country
      })
      const fedJson = fed.toJSON()
      res.send({
        fed: fedJson,
      })
      }catch (error) {
        res.status(400).send({
          error: error.message
        })
      }
  },

  async findFederationById(req,res) {
    const fed = await Federation.findOne({where: {id:req.params.id},include:[Club]})
    if (fed) {
 
      return res.status(200).send({fed: fed.toJSON()})
    }
    else return res.status(404).send("federation not found")
  },
  

  async allFederations(req,res) {
    const feds = await Federation.findAll()
    res.status(200).send({feds})
  },

  async deleteFederation(req,res) {
    await Federation.destroy({
      where: {
        id: req.params.id
      }
    })   
    res.send("fed a été supprimé")
  },
   // update fed
 
  async editFederation(req,res) {
    const fed = await Federation.findOne({where:{id:req.params.id}})
     if(fed) {
         await fed.update({
          name:req.body.name,
      managerfullName:req.body.managerfullName,
      adress:req.body.adress,
      phone:req.body.phone,
      email:req.body.email, 
      country:req.body.country,
     
       },
       {
         where: {id: req.params.id}
       })
       res.send("fed updated")
     } else {
     res.send("fed n'exist pas")
   }
 },
async clubUnderFed(req,res){
  const clubs = await Club.findAll({where: {FederationId:req.body.id}})
  if (clubs) {
 
    return res.status(200).send({clubs})
  }
  else return res.status(404).send("federation not found")
},


async usersUnderFed(req,res){
  const users = await User.findAll({where: {FederationId:req.body.FederationId,role:"athlete"}})
  if (users) {
 
    return res.status(200).send({users})
  }
  else return res.status(404).send("federation not found")
},
async clubUnderFeds(req,res){
  const users = await User.findAll({where: {FederationId:req.params.FederationId}})
  if (users) {
 
    return res.status(200).send({users})
  }
  else return res.status(404).send("federation not found")
},
async uniqueEmail(req,res) {
  const { email } = req.body;
  const exist = await Federation.findOne({where: {
    email: email
  }});
  if (exist) {
    return res.status(200).send('email exist');}
  else
  { return res.status(404).send('email doesn eists');
}
},

}





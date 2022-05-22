const fetch = require('node-fetch')
const {User,Token,Event,Category,Club} = require('../models')
const config2 = require('../config2/config')
const config = require('../config/config')
const { sendConfirmationEmail, sendResetPasswordEmail,sendAcceptationEmail,sendRefuseEmail } = require('../mailer');
const { errorMonitor } = require('nodemailer/lib/xoauth2');
function eligeable(ch,weight,sexe1,sexe2,matricule){
  var substr = ch.split('/')
 console.log(ch)
  if((substr.indexOf(weight) != -1) && (sexe1==sexe2) && matricule != "Non disponible" )
  {return true}
  else return false


}
var catId=""
module.exports = {
  // create Event 
 async createEvent (req, res) {
  var substr = req.body.categories.split('/')
  console.log(substr)

  try {
    const event = await Event.create({
        name:req.body.name,
        start:req.body.start,
        end:req.body.end,
        deadline:req.body.deadline,
        location:req.body.location,
        description:req.body.description,
        image:req.file.path,
      })
       await substr.forEach(element => {
        Category.findOne({where:{id:element}}).then(response =>{
          event.addCategory(response)
        })
         
   });

  

      const EventJson = event.toJSON()
      res.send({
        event: EventJson,
      })
      }catch (error) {
        res.status(400).send({
          error: error.message
        })
      }
  },
 
  async allEvents(req,res) {
    try{    const competitions = await Event.findAll({include:[Category]})
    res.status(200).send({competitions})

  }catch(error){
    res.status(400).send({
      error: error.message
    })
  }
  },


   
  async editEvent(req,res) {
    const event = await Event.findOne({where:{id:req.params.id}})
     if(event) {
         await event.update({
      name:req.body.name,
      location:req.body.location,
      start:req.body.start,
      end:req.body.end,
     
       },
       {
         where: {id: req.params.id}
       })
       res.send("event updated")
     } else {
     res.send("event n'exist pas")
   }
 },

 async deleteEvent(req,res) {
  await Event.destroy({
    where: {
      id: req.params.id
    }
  })   
  res.send("event a été supprimé")
},

async getCategorie(req,res) {
  try{const cat = await Category.findAll()
  res.status(200).send({cat})}
  catch(error){
    res.status(400).send({
      error: error.message
    })}

},
async findEventById(req,res) {
  const event = await Event.findOne({where: {id:req.params.id},include:[Category,User]})
  if (event) {
    console.log(event)

    return res.status(200).send({competition: event.toJSON()})
  }
  else return res.status(404).send("user not found")
},
async findCatById(req,res) {
  const cat = await Category.findOne({where: {id:req.params.id},include:[Event]})
  if (cat) {
    return res.status(200).send({cat:cat.toJSON()})
  }
  else return res.status(404).send("category not found")
},


async findCategoryById(req,res) {
  const cat = await Category.findAll({where: {id:req.body.id},include:[Event]})
  if (cat) {
    return res.status(200).send({cat})
  }
  else return res.status(404).send("category not found")
},
async eliminerUser(req,res){
  try {
    const event = await Event.findOne({where:{id:req.body.eventId}})
    const user = await User.findOne({where:{id:req.body.userId}})

       await event.removeUser(user)

      res.send({
        message: "ok",
      })
    
      }catch (error) {
        res.status(400).send({
          error: error.message
        })
      }},

async inscription (req, res) {
  try {
    const event = await Event.findOne({where:{id:req.body.compId}})
    const user = await User.findOne({where:{id:req.body.userId}})
      await event.addUser(user,{ through: { catId: catId } })
      const EventJson = event.toJSON()
      res.send({
        competition: EventJson,
      })  
      }catch (error) {
        res.status(400).send({
          error: error.message
        })
      }
  },
  async in (req, res) {
    try {
      const event = await Event.findOne({where:{id:req.body.compId}})
      const users = await event.getUsers({though:{catId:catId}})
        res.send({
          users: users,
        })  
        }catch (error) {
          res.status(400).send({
            error: error.message
          })
        } 
    },
    async elig (req, res) {
      try {
        const competition = await Event.findOne({where:{id:req.body.compId}})
        const user = await User.findOne({where:{id:req.body.userId}})
        const cat = await competition.getCategories()
        let i=0
     while(i<cat.length)
    {    if(eligeable(cat[i].weight,user.weight,cat[i].sexe,user.sexe,user.matricule)==true)
      {
        catId=cat[i].id
           res.status(200).send({message:"ok"})
           break
          }
          else{i++}
        }
        
          }catch (error) {
            res.status(400).send({
              error: error.message
            })
          }
      },
async participantList(req,res) {
  try{
  const event = await Event.findOne({where:{id:req.body.id}})
  const users= await event.getUsers({include:[Club]})
  res.send({
users  })
  }catch(error){
    res.status(400).send({
      error: error.message
    })
  }
},

async recentEvent(req,res){
  try{
    const competitions = await Event.findAll({ limit: 6,
      where: {
        //your where conditions, or without them if you need ANY entry
      },
      order: [ [ 'createdAt', 'DESC' ]]
  })
  res.status(200).send({competitions})
}
  catch(error){
      res.status(400).send({
        error: error.message
      })
  }
},
async createCategorie (req, res) {
  try {
    const category = await Category.create({
        nameCat:req.body.nameCat,
        sexe:req.body.sexe,
        weight:req.body.weight,
        type:req.body.type,
        age:req.body.age,
        start:req.body.start,
        end:req.body.end    })
      const categoryJson = category.toJSON()
      res.send({
        category: categoryJson,
      })
      }catch (error) {
        res.status(400).send({
          error: error.message
        })
      }
  },
async allCategories(req,res) {
  const categories = await Category.findAll()
  res.status(200).send({categories})
},

// get categories by event
async allCategoriesByEvent(req,res) {
  try{
    const event = await Event.findOne({where:{id:req.params.id}})

      const categories =await event.getCategories()

      const users =await event.getUsers()
      console.log("uuu",users)

    res.send({
      categories,users  })
    }catch(error){
      res.status(400).send({
        error: error.message
      })
    }
},


async findEventByCat(req,res) {
  const event = await Event.findAll({through: {where:{catId:2}}})
  if (event) {

    console.log("v",event)
    return res.status(200).send({event})
  }
  else return res.status(404).send("user not found")
},

}





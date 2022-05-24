const fetch = require('node-fetch')
const {User,Token,Club,Record,Federation} = require('../models')
const jwt = require('jsonwebtoken')
const config2 = require('../config2/config')
const config = require('../config/config')
const { Op } = require("sequelize");


const bcrypt = require('bcrypt') 
const { sendConfirmationEmail, sendResetPasswordEmail,sendAcceptationEmail,sendRefuseEmail } = require('../mailer');
const saltRounds =10
function generateLevel(date){
  const dt = new Date(date)
  const now =  new Date()
  console.log(dt)
  const age= now.getFullYear() - dt.getFullYear()
  console.log(age)
  var categorie=''
  switch (age) {
    case 6: 
    case 7:
    categorie= "Poussins"
        break;
    case 8:
    case 9:
      categorie= "Pupilles"
      break;
      case 10:
        case 11:
          categorie= "Benjamins"
          break;
          case 12:
            case 13:
              categorie= "Minimes"
              break;

              case 14:
                case 15:
                  categorie= "Cadets"
                  break;
                  case 16:
                    case 17:
                      categorie= "Juniors"
                      break;
                      case 18:
                          categorie= "Séniors"
                          break;
                          case 19:
                            case 20:
                            categorie= "Espoirs"
                            break;
                            case 35:
                            case 36:
                            case 37:
                            case 38:
                            case 39:
                            case 40:
                            case 41:
                            case 42:
                            case 43:
                            case 44:
                            case 45:
                              categorie= "Vétérans 1"
                              break;
                              case 35:
                                case 47:
                                case 48:
                                case 49:
                                case 50:
                                case 51:
                                case 52:
                                case 53:
                                case 54:
                                case 55:
                               
                                  categorie= "Vétérans 2"
                                  break;
                                  case 56:
                                case 57:
                                case 58:
                                case 59:
                                case 60:
                                case 61:
                                case 62:
                                case 63:
                                case 64:
                                case 65:
                               
                                  categorie= "Vétérans 3"
                                  break;
                             
    default: categorie="Vétérans 4"
}
console.log(categorie) 
return categorie
}
function jwtSignUser (user) {
  const ONE_WEEK = 60 * 60 * 24 * 7
  return jwt.sign(user, config2.authentication.jwtSecret, {
    expiresIn: ONE_WEEK
  })}
  function jwtSignRefreshUser (user) {
    const ONE_WEEK = 60 * 60 * 24 * 7
    return jwt.sign(user, config2.authentication.jwtRefreshSecret, {
      expiresIn: ONE_WEEK
    })
}


module.exports = {
   // add admin function
   async addAdmin (req, res) {
    const body = req.body;
    try {
    const salt = await bcrypt.genSalt(10);
    // now we set user password to hashed password
    pass = await bcrypt.hash(body.password, salt);
    const user = await User.create({
        lastname:req.body.lastname,
        name:req.body.name,
        phone:req.body.phone,
        role: req.body.role,
        image:req.body.image,
        email:req.body.email,
        password :pass,
        isAccountActive:true,
      })
      const userJson = user.toJSON()
      res.send({
        user:userJson
      })
      }catch (error) {
        res.status(400).send({
          error: error.message
        })
      }
  },
 
  // register function
    async register (req, res) {
      console.log(req.file)
      var arra=[]
    const body = req.body;
    try {
    const salt = await bcrypt.genSalt(10);
    const level= generateLevel(req.body.birthDate)
    // now we set user password to hashed password
    pass = await bcrypt.hash(body.password, salt);
    const user = await User.create({
        lastname:req.body.lastname,
        name:req.body.name,
        phone:req.body.phone,
        role:"athlete",
        image:req.file.path,
        email:req.body.email,
        password :pass,
        weight:req.body.weight,
        height:req.body.height,
        birthDate:req.body.birthDate,
          belt:req.body.belt,
          certification:req.body.certification,
          medicalCertificate:req.body.medicalCertificate,
          level:level,
          ClubId:req.body.ClubId,
          FederationId:req.body.FederationId,
          sexe:req.body.sexe,
          matricule:req.body.matricule        
      })
      arr=JSON.parse(req.body.records)
      const record = await arr.forEach(element => {
         Record.create({
           UserId:user.id,
          recordDate: element.recordDate,
          title: element.title
        })
    });
      const userJson = user.toJSON()
      res.send({
        message : "please wait until your request is approved"
      })
      }catch (error) {
        res.status(400).send({
          error: error.message
        })
      }
  },
  // accept or refuse register(by the admin)
  async acceptRegister (req, res) {
    const user = await User.findOne({where: {id:req.params.id}})
    if (user) {
      await user.update({ isAccountActive: true })
      await sendAcceptationEmail({toUser: user})
      return res.status(200).send({message:"user accepted"})
     }else{
      return res.status(404).send({message:"user not found "})
      }  },
    // refuse 

    async refuseRegister (req, res) {
        const userInfo = await User.findOne({
          where:{id: req.params.id}
        })
        const user =  await User.destroy({
          where: {
            id: req.params.id
          }
        })
        await sendRefuseEmail({toUser: userInfo})
        return res.status(200).send({message:"user refused"})
      },
 

  // login function
   async login (req, res) {
    try {
      const body = req.body;
      // first checking if recaptcha valid

      const secret_key = '6Lehd4QeAAAAACVHQHcW6lr7P3LqoHo14crz8k3v';
      const url =
     `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${req.body.token}`;

     const human= await  fetch(url, {
      method: "post",
       })
      .then((response) => response.json())
      .then((google_response) => {

        // google_response is the object return by
        // google as a response
        if (google_response.success == true) {
          //   if captcha is verified
          return true;
        } else {
          // if captcha is ;not verified
          return true;
        }
      })
      if (!human) {

        res.status(400).json({ error: "you are not a humain" });
        return;
      }


      // if recaptcha valid , checking if email exist
      const user = await User.findOne({
        where: {
          email: body.email
        }
      })
      // if user eist
      if(user)
      { // checking if user account is active
        if(user.isAccountActive==true){
          // if user account is active => check password 
        const validPassword = await bcrypt.compare(body.password, user.password);
        if (validPassword) {
          const userJson = user.toJSON()
          res.send({
            user: userJson,
            token: jwtSignUser(userJson),
            refreshToken:jwtSignRefreshUser(userJson)
          })
        } else {
          res.status(400).json({ error: "Mot de passe invalide" });
        }
      }
      else{
        // account not active
        res.status(400).json({ error: "please wait until you account is approved" });

      }
        
        
      } else {
        // user does not exist
        res.status(401).json({ error: "Utilisateur n'existe pas" });
      }

    } catch (err) {
      res.status(500).send({
        error: err.message
      })
    }
  },

  // reset password function

  async resetPassword(req, res) {

    try {
      const user = await User.findOne({where:{email :req.body.email}});
      if (!user) { return res.status(404).json({ error: "Utilisateur n'existe pas" }); }

      const hasHash = await Token.findOne({where:{user_id: user.id}});
      if (hasHash) { return res.status(422).json({ error: "email already sent" }); }

      const hash = new Token({user_id: user.id});
      await hash.save();
      await sendResetPasswordEmail({toUser: user, hash: hash.id});
      return res.json({message: 'Please check your email to reset the password!'})
    } catch (error) {
      return res.status(404).json({ error: "Utilisateur n'eerr pas" });
    }
  },
  async confirmReset(req, res) {
    const password = req.body.password;

    try {
      const aHash = await Token.findOne({id: req.params.id});
      if (!aHash || !aHash.user_id) {
        return res.status(422).send('token not found reset a password!');
      }

      const user = await User.findOne({id: aHash.user_id});
      if (!user) {
        return res.status(422).send('user not found reset a password!');

      }

      await aHash.destroy();
      const salt = await bcrypt.genSalt(10);
      pass = await bcrypt.hash(password, salt);
      await user.update({ password: pass })
      // The database now has "Ada" for name, but still has the default "green" for favorite color
      await user.save()
      return res.json({message: 'Password has been reseted!'});
    } catch(error) {
      return res.status(422).send(error.message);
    }
  },

  async uniqueEmail(req,res) {
      const { email } = req.body;
      const exist = await User.findOne({where: {
        email: email
      }});
      if (exist) {
        return res.status(200).send('email exist');}
      else
      { return res.status(404).send('email doesn eists');
    }
  },
  async usersWithMatricule(req,res) {
    const users = await User.findAll({where:{
      matricule:{[Op.not]: 'Non disponible'},
      FederationId:req.params.id,
      isAccountActive:true,
      role:"athlete"
    }})
    res.status(200).send({users})
  },
  // all users
  async allUsers(req,res) {
    const users = await User.findAll({where:{
      isAccountActive:true
    }})
    res.status(200).send({users})
  },
  //all pending requests
  async allPendingRequests(req,res) {
    const users = await User.findAll({where:{
      isAccountActive:false
    }})
    res.status(200).send({users})
  },
 // find user by id
 async findUserById(req,res) {
   const user = await User.findOne({where: {id:req.params.id},include:[Club,Record,Federation]})
   if (user) {

     return res.status(200).send({user: user.toJSON()})
   }
   else return res.status(404).send("user not found")
 },
 // delete by id
 async deleteUser(req,res) {
   await User.destroy({
     where: {
       id: req.params.id
     }
   })
   res.send("Utilisateur a été supprimé")
 },
  // update user

 async editUser(req,res) {
   const user = await User.findOne({where:{id:req.params.id}})
    if(user) {
        await User.update({
        name: req.body.name,
        lastname: req.body.lastname,
        phone: req.body.phone,
        email:req.body.email,
        weight:req.body.weight,
        height:req.body.height,
        medicalCertificate:req.body.medicalCertificate,
        belt:req.body.belt,
        sexe:req.body.sexe,
        ClubId:req.body.ClubId,
        FederationId:req.body.FederationId,
        
      },
      {
        where: {id: req.params.id}
      })
      res.send("user updated")
    } else {
    res.send("user n'exist pas")
  }
},

async allAthletes(req,res) {
  const users = await User.findAll({where:{
    role:"athlete",
    isAccountActive:true,
  },include:[Record,Club,Federation]})
  res.status(200).send({users})
},

async athletesBySexe(req,res) {
  const users = await User.findAll({where:{
    sexe: req.body.sexe,
    role:"athlete"
  }})
  res.status(200).send({users})
},

async athletesByLevel(req,res) {
  const users = await User.findAll({where:{
    level: req.body.level,
    role:"athlete"
  }})
  res.status(200).send({users})
},

async userRecords(req,res) {
  const records = await Record.findAll({where:{
    UserId: req.body.UserId
  }})
  res.status(200).send({records})
},

async getRefreshToken(req,res) {
 const authHeader = req.headers['authorization']
 const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, config2.authentication.jwtRefreshSecret, (err, user) => {
    if (err) {
      return res.sendStatus(401)
    }
    delete user.iat 
    delete user.exp

    const refreshedToken = jwtSignUser(user)
    res.send({
      accessToken: refreshedToken,
    })
}
  )}

}
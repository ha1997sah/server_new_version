const Joi = require('joi')
module.exports = {
    register (req, res, next)
    {

    const schema = Joi.object({
        name:Joi.string().min(3),
        lastname:Joi.string().min(3),
        phone:Joi.string().min(8),
        position:Joi.string().min(3),
        email:Joi.string().email(),
        password:Joi.string(),
        weight:Joi.string(),
        height:Joi.string(),
        belt:Joi.string(),
        birthDate:Joi.date(),
        ClubId:Joi.string()
        
    });
    const { error } = schema.validate(req.body);


    if (error) {
      switch (error.details[0].context.key) {
        case 'email':
          res.status(400).send({
            error: 'Veuillez entrer une adresse e-mail valide'
          })
          break
        case 'password':
          res.status(400).send({
            error:
            'Votre mot de passe doit comporter entre 8 et 32 caractères et contenir une majuscule, un symbole et un chiffre '
          })
          break
          case 'name':
          res.status(400).send({
            error: 'Veuillez entrer un nom valide'
          })
          break
          case 'lastname':
          res.status(400).send({
            error: 'Veuillez entrer un prénom valide'
          })
          break
          case 'phone':
          res.status(400).send({
            error: 'Veuillez entrer un numéro de téléphone valide'
          })
          break
          case 'position':
          res.status(400).send({
            error: 'Veuillez entrer une fonction valide'
          })
          break
        default:
          res.status(400).send({
            error: error.message
          })
      }
    } else {
        next()
    }
}}
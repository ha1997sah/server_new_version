const fetch = require('node-fetch')
const {User,Club,Federation,Event,Match} = require('../models')
const config = require('../config/config')
const sequelize = require("sequelize");
const { Op } = require("sequelize");

module.exports = {


  // all notifications
  async stat(req,res) {
 const sexe= await User.findAll({
      group: ['sexe'],
      attributes: ['sexe', [sequelize.fn('COUNT', 'sexe'), 'TagCount']],
    });



    const nbClub= await Club.findAll({
      attributes: [ [sequelize.fn('COUNT', 'id'), 'nbClub']],
    });


    const nbFed= await Federation.findAll({
      attributes: [ [sequelize.fn('COUNT', 'id'), 'nbFed']],
    });

    const nbEventTotal= await Federation.findAll({
      attributes: [ [sequelize.fn('COUNT', 'id'), 'nbEv']],
    });
    const matches= await Match.findAll({
      attributes: [ [sequelize.fn('COUNT', 'id'), 'nbMatches']],
    });
    const nbEvent= await Event.findAll({
      attributes: [ [sequelize.fn('COUNT', 'id'), 'nbEvent']],
    });
   const eventsPerYear= await Event.findAll({
    attributes: [
      [ sequelize.fn( 'year', sequelize.col('createdAt')), 'year'],
      [ sequelize.fn('count', '*'), 'count']
    ],
    group: 'year'
    }) 
    // past event
   

    const today = new Date()
console.log(today)
    const pastEvent = await Event.count( {
      where: {
        end: 
          {[Op.lt]: today}
      
      },
   });
   const todaysEvent = await Event.count( {
    where: {
      start: {[Op.eq] : today}
    },
 });
 const upcomingEvent = await Event.count({
  where: {
    start: {[Op.gt] : today}
  },
});
   res.status(200).send({series:{data:[10,11,5]},sexe,nbClub,nbEvent,nbFed,eventsPerYear,nbEventTotal,matches,pastEvent,todaysEvent,upcomingEvent}) 



  },



}
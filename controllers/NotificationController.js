const fetch = require('node-fetch')
const {Notification} = require('../models')
const config = require('../config/config')


module.exports = {


  // all notifications
  async allNotifications(req,res) {
    const notifications = await Notification.findAll()
    res.status(200).send({notifications})
  },



}
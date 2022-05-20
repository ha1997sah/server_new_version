const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const db = require('morgan');
const path = require("path")

const {sequelize} = require('./models');
const app = express();
app.use(morgan('combine'))
app.use(bodyparser.json())
app.use('/uploads',express.static('uploads'))
app.use(cors())
require('./routes')(app)
// the server take app as an arg
var server = require("http").createServer(app)
// integrate socket with our server
var io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
    credentials:true
  },
  allowEIO3: true
})
require('./scoring')(io)



sequelize.sync()
  .then(()=>{
    server.listen(3001,() => console.log("running"))
  })

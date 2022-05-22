const {Match,Round} = require("./models")
var  i=0
var p1=""
var p2=""
var winner=""
var nextMatch=0
 

module.exports = io => {
    io.on("connection", socket => {
     console.log("conbbbbbbbbbbbbbb")
    
     socket.on("matches", async(data)=>{
       const round = await Round.findAll({where:{CategoryId:data.catId},include:[Match]})
       socket.emit("matchesRep",{rounds:round})
     })
 
     socket.on("update_score", async(data)=>{
      
      // const round = await Round.findOne({where:{id:roundId},include:[Match]})
      const match = await Match.findOne({where:{matchIndex:data.m,RoundId:data.roundId}})
      nextMatch=match.nextMatch
      await match.update({
        palyer1_score:data.s1,
        player2_score:data.s2,
    
      })
      if(data.s1>data.s2){
        winner=match.player1
        } else{winner=match.player2}
       
          let rdIndex= ++data.roundIndex
          console.log(rdIndex,nextMatch,p1,p2)
      const round = await Round.findOne({where:{roundIndex:rdIndex}})
      const match2 = await Match.findOne({where:{RoundId:round.id,matchIndex:nextMatch}})
      if(data.m % 2 == 0){
        await match2.update ({
          player1:winner,
         
        })
    } 
        else{ await match2.update ({
         
          player2:winner
        })
    }
     
      const rds = await Round.findAll({include:[Match]})

      io.sockets.emit("updated",{rounds:rds})
      i++


    })

     socket.on("persist", async (data ) => {
        const tournament = await Match.create({
          num: "b",
          loser: "data.loser",
        })

        socket.emit("test",{message:"ok"})

       
     })

    })
  }
  
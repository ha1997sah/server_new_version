const {Club,User} = require('../models')
const {Match,Round} = require("../models")
var  i=0
var p1="" 
var p2=""
var winner=""
var nextMatch=0
var match ={
  player1:null,
  player2:null,
  palyer1_score:0,
  player2_score:0,
}

function generate_first_round(players,seed){

  var nb_players=players.length
    // first tound number of slots
    first_round_slots = (1 << Math.ceil(Math.log2(nb_players, 2)))
    // number of matches
    nb_matches = first_round_slots / 2
    // number of byes(first round only)
    nb_byes = first_round_slots - nb_players
    nb_byes_upper=Math.floor(nb_byes/2)
    nb_byes_lower=nb_byes-nb_byes_upper
    middle=nb_matches/2
     //first round matches
     var matches = []
  for (var i=0;i<nb_matches;i++)
       {matches.push( Object.create(match))}

       // if seed == false
    if (seed == false)
    { distribute_byes(0,middle-1,nb_byes_upper,matches,'u')
     distribute_byes(middle,matches.length-1,nb_byes_lower,matches,'l')
     addPlayerToBracket(players,matches) }
     else // with seed
     {const resultPlayers=withSeeds(players)
      addPlayerToBracketWithSeed(resultPlayers,matches)
     }

     return matches
    }

function distribute_byes(begin, end,nb_byes,matches,pos)
{
    var i=0
    var index= pos=="u" ? begin : end;
    while(i<nb_byes)
    {  i++
    if(index==end)
    {   matches[index].player2="bye"
        index=begin
        end--}
    else{matches[index].player2="bye"
        index=end
        begin++} }}
        // add players to bracket (with seed)

       function addPlayerToBracketWithSeed(players,matches){

        let i=0
        let matchIndex=0
       console.log(players)
        loop1:
        while(i<players.length)
       {           

         if(i%2==0)
        {if(players[i]=="bye")
       {matches[matchIndex].player1="bye"
       }
       else{
         matches[matchIndex].player1=players[i].name
       }
       if(players[++i]=="bye")
      {matches[matchIndex].player2="bye"
      }
      else{
        matches[matchIndex].player2=players[i].name
      }
      
      }
       // i%2 !=0
       else{
        {if(players[i]=="bye")
        {matches[matchIndex].player2="bye"
        }
        else{console.log(players[i].name)
          matches[matchIndex].player2=players[i].name
        }
      }
      if(players[++i]=="bye")
      {matches[matchIndex].player1="bye"
      }
      else{
        matches[matchIndex].player1=players[i].name
      }
      
       }
   i++
matchIndex++}}
      
    
              // add players to bracket (without seed)
function addPlayerToBracket(players,matches){

  let i=0
  let matchIndex=0

  loop1:
  while(i<players.length)
 {
         if(matches[matchIndex].player1==null&&matches[matchIndex].player2==null)
         {matches[matchIndex].player1=players[i].name
          matches[matchIndex].player2=players[++i].name
          i++
         }
          else if(matches[matchIndex].player2==null)
              {
              matches[matchIndex].player2=players[i].name
              i++}else{
              matches[matchIndex].player1=players[i].name
              i++}
     matchIndex++}}


     function withSeeds(participants)
     {
       var participantsCount = participants.length;	
       var rounds = Math.ceil(Math.log(participantsCount)/Math.log(2));
       var bracketSize = Math.pow(2, rounds);
       var requiredByes = bracketSize - participantsCount;
     
         
       if(participantsCount < 2) {
         return [];
       }
         
       var matches = [[participants[0],participants[1]]];
       
       for(var round = 1; round < rounds; round++) {
         var roundMatches = [];
         var pl = [];
         var sum = Math.pow(2, round + 1) + 1;
         
         for(var i = 0; i < matches.length; i++) {
           var home = changeIntoBye(matches[i][0].seed,participants, participantsCount);
           var away = changeIntoBye(sum - matches[i][0].seed,participants, participantsCount);
           pl.push(home);
           pl.push(away);
           roundMatches.push([home, away]);
     
     
           home = changeIntoBye(sum - matches[i][1].seed,participants, participantsCount);
           away = changeIntoBye(matches[i][1].seed,participants, participantsCount);
           pl.push(home);
           pl.push(away);
           roundMatches.push([home, away]);
     
         }
         matches = roundMatches;   
       }   
     
     
       return pl;    
     }
     
     function changeIntoBye(seed,players, participantsCount)
     {   let player= players.find(p => p.seed == seed)
         //return seed <= participantsCount ?  seed : '{0} (= bye)'.format(seed);  
         return seed <= participantsCount ?  player : "bye";
     }
    

module.exports = {
   // to verify if the algo has lanced before
    async hasRound(req,res){
      const exist =await Round.findOne({where:{CategoryId:req.body.catId}})
      console.log(exist)
      if(exist){
        res.send({show:true})
      }else{res.send({show:false})}
    },
    // generate
    async generate(req,res){
          const players = req.body.players
          const algo = req.body.algo
          const seed =req.body.seed
          console.log(algo,seed,"seed+algo")
          if(algo=="1"){
           var matches= generate_first_round(players,seed)
          }
           var index=0
           var roundIndex=0
           const round= await Round.create({
            name:"phase 0",
            nb_matches:Math.floor(matches.length),
            roundIndex:roundIndex,
            CategoryId:req.body.catId
          })
          let nextMatch =0
          for (var i=0;i<matches.length;i++)
          {if(i !=0 && i%2==0){nextMatch++}
        const match1=await Match.create({
               player1:matches[i].player1,
               player2:matches[i].player2,
               player2_score:0,
               palyer1_score:0,
               matchIndex:index,
               nextMatch:nextMatch,
      
             })
             index++
         await    round.addMatch(match1)
      
           }
      
           //next rounds
           var nb_matches=matches.length
           var nbrounds= Math.log2(nb_matches)
           for(let current=1;current<=nbrounds;current++)
               {
                 const round= await Round.create({
                 name:"phase"+current,
                 nb_matches:Math.floor(nb_matches/2),
                 roundIndex:++roundIndex,
                 CategoryId:req.body.catId

               })
               nb_matches=Math.floor(nb_matches/2)
               var ind=0
               let nextMatch=0
               for (var i=0;i<nb_matches;i++)
              { console.log(i)
                if(i !=0 && i%2==0){console.log("ok") ,nextMatch++}
              const match= await Match.create({
                 player1:null,
                 player2:null,
                 player2_score:0,
                 palyer1_score:0,
                 matchIndex:ind,
                 nextMatch:nextMatch

           
               })
               ind++
             await   round.addMatch(match)
           
                 }
              }
           // end
           const rd = await Round.findAll({include:[Match]})
      res.send({rd})
         
    },

  }


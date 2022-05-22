const AuthenticationController = require('./controllers/AuthenticationController')
const ClubController = require('./controllers/ClubController')
const EventController = require('./controllers/EventController')
const FederationController = require('./controllers/FederationController')
const NotificationController = require('./controllers/NotificationController')
const Club = require('./models/Club')
const validation = require('./validations/validation')
const multer = require('multer')
const BracketController = require('./controllers/BracketController')
const DashboardController = require('./controllers/DashboardController')
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null,'./uploads/');
    },
    filename: function(req, file,cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-')+ file.originalname);
    }
})
const photo = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null,'./uploads/');
    },
    filename: function(req, file,cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-')+ file.originalname);
    }
})
const upload = multer({storage: storage})
const uploadPhoto = multer({storage: photo})
module.exports = (app) =>
{
    app.post('/register',upload.single('medicalCertificate'),    AuthenticationController.register),

    app.post('/addAdmin',
    AuthenticationController.addAdmin
    )

    app.post('/login',
    AuthenticationController.login),
    app.post('/getRefreshToken',
    AuthenticationController.getRefreshToken),

    app.post('/reset',
    AuthenticationController.resetPassword),

    app.post('/confirmReset/:id',
    AuthenticationController.confirmReset),

    app.post('/validate/email',
    AuthenticationController.uniqueEmail),
    app.post('/club/validate/email',
    ClubController.uniqueEmail),
    app.post('/fed/validate/email',
    FederationController.uniqueEmail),
    app.get('/users',
    AuthenticationController.allUsers),
    app.get('/usersWithMatricule/:id',
    AuthenticationController.usersWithMatricule)

    app.get('/allPendingRequests',
    AuthenticationController.allPendingRequests),

    app.get('/user/:id',
    AuthenticationController.findUserById),

    app.post('/acceptRegister/:id',
    AuthenticationController.acceptRegister),

    app.delete('/refuseRegister/:id',
    AuthenticationController.refuseRegister),

    app.delete('/delete/:id',
    AuthenticationController.deleteUser),

    app.put('/edit/:id',
    AuthenticationController.editUser),

    //Notifications

    app.get('/notifications',
    NotificationController.allNotifications)

    // Event
    app.post('/addEvent',upload.single('compImage'),
    EventController.createEvent)
    
    app.post('/addCategory',
    EventController.createCategorie)

    app.get('/Event/:id',
    EventController.findEventById)
    
    app.post('/eventByCat',EventController.findEventByCat)

    app.get('/category/:id',
    EventController.findCategoryById)
    app.get('/categoryById/:id',
    EventController.findCatById)

    app.get('/allEvents',
    EventController.allEvents)
    app.get('/allCategories',
    EventController.allCategories)
    //byevent
    app.post('/allCategoriesByEvent/:id',
    EventController.allCategoriesByEvent)
    //clubs
    app.post("/createClub",
    ClubController.createClub)

    app.get("/club/:id",
    ClubController.findClubById)

    app.put("/editClub/:id",
    ClubController.editClub)

    app.delete("/deleteClub/:id",
    ClubController.deleteclub)
    app.get("/allClubs",
    ClubController.allClubs)
    //federations
    app.get('/allFederations',
    FederationController.allFederations)
    
    app.post("/createFederation",
    FederationController.createFederation)

    app.get("/federation/:id",
    FederationController.findFederationById)
    
    app.put("/editFederation/:id",
    FederationController.editFederation) 

    app.delete("/deleteFederation/:id",
    FederationController.deleteFederation)
    app.post("/clubUnderFed",
    FederationController.clubUnderFed)
    app.get("/clubUnderFeds/:id",
    FederationController.clubUnderFeds)
    app.post("/usersUnderClub",
    ClubController.usersUnderClub)
    app.post("/usersUnderFed",
    FederationController.usersUnderFed)
  
     
    
     
    app.put("/editEvent/:id",
    EventController.editEvent) 
    app.delete("/deleteEvent/:id",
    EventController.deleteEvent)

    app.get("/allAthletes",
    AuthenticationController.allAthletes)

    app.post("/athletesBySexe",
    AuthenticationController.athletesBySexe)

   app.post("/athletesByLevel",
   AuthenticationController.athletesByLevel)

   // categorie des poids 

   app.get('/getCategorie',
   EventController.getCategorie)

   app.post('/inscri',
   EventController.inscription)
   app.post('/in',
   EventController.in)
   app.post('/eliminer',
   EventController.eliminerUser)
   app.post('/elig',
   EventController.elig)
   app.post('/participantList',
   EventController.participantList)
   app.get('/recentEvent',
   EventController.recentEvent)
   app.post('/userRecords', AuthenticationController.userRecords)
   app.post('/generate',BracketController.generate)
   app.post('/hasRound',BracketController.hasRound)



   // dashboard
   app.get('/stat',DashboardController.stat)
}


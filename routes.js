

const passport = require('passport')
const passportService = require('./service/passport')
const requireSignin = passport.authenticate('local', { session: false })
const requireAuth = passport.authenticate('jwt', { session: false })
const users = require('./controllers/Users')
const Patient = require('./controllers/Patient')
const Getpdf = require('./controllers/GetPdf/getPdf')
const AddLog = require('./controllers/Log/AddLog')



// const MailSend = require('./controllers/MailSend/Index')




module.exports = function (app) {
    app.get('/', function (req, res) {
        res.send("<h1 style='text-align:center;margin-top:150px; '>Auction Api</h1>")
    })
    app.post('/signin', requireSignin, users.signin)

   
    app.get('/find-hn/:hn',Patient.findPatient)
    // app.get('/users',requireAuth, users.findAll)
    // app.get('/chkuser/:id',requireAuth,users.findUser)
    // app.get('/profile/:id',requireAuth,users.findProfile)
    // app.get('/profile-pay/:id',requireAuth,users.findProfilePay)
    // app.get('/profile-history/:id',requireAuth,users.findHistory)
    // app.get('/user-staff/:id',requireAuth,users.findUserStaff)
    // app.get('/post-count/:id',requireAuth,users.findPostCount)
    // app.get('/auction-count/:id',requireAuth,users.findAuctionCount)

    app.get('/get-pdf/:hn',Getpdf.getPdf)
    app.post('/log-add',AddLog.create)



}

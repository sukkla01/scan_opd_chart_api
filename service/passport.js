const passport = require('passport');
const LocalStrategy = require('passport-local')
const JwtStrategy = require('passport-jwt').Strategy,
     ExtractJwt = require('passport-jwt').ExtractJwt

const config = require('../config')
const localOptions = { passReqToCallback: true }
const localLogin = new LocalStrategy(localOptions, function (req, username, password, done) {
    req.getConnection((err, connection) => {
        if (err) return next(err)
        connection.query("select * from user where BINARY username=?  ", [username], (err, row) => {
           
            if (err) return done(err)
            if (!row.length) return done(null, false)
            if (row[0].password !== password) {
                return done(null, false)
            } else {
                return done(null, row[0])
            }
        })
    })
})
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('token'),
    secretOrKey: config.secret,
    passReqToCallback: true
};
const jwtRoute = new JwtStrategy(jwtOptions, function (req, payload, done) {
    req.getConnection((err, connection) => {
        if (err) return next(err)
        connection.query("select * from user where cid=?", [payload.cid], (err, row) => {
            if (err) return done(err)
            if (!row.length) return done(null, false);
            return done(null, row[0])
        })
    })
})
passport.use(localLogin)
passport.use(jwtRoute)
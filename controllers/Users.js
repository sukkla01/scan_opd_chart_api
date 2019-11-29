const jwt = require('jwt-simple')
const config = require('../config')
//var time = require('time');

function tokenForUser(user) {
    const timestamp = new Date().getTime()
    return jwt.encode({
        fullname: user.fullname,
        username: user.username
        // iat: timestamp
    },
        config.secret
    )
}

exports.signin = (req, res, next) => {
    res.send({ token: tokenForUser(req.user) })
}


exports.findAll = (req, res, next) => {
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "select * from user ";
        var params = "%" + req.query.term + "%"
        connection.query(sql, (err, results) => {
            if (err) return next(err)
            res.send(results)
        })
    })
}

//users success
exports.findById = (req, res, next) => {
    // var username = parseInt(req.params.id)
    var strqrcode = req.params.id
    // console.log(strqrcode + ':test');
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "SELECT c.username,Name,d.DEPTNAME,u.image,c.stamp_date,c.stamp_time " +
            "FROM checkinout c " +
            "LEFT JOIN userinfo u ON u.username = c.username " +
            "LEFT JOIN dep d ON d.deptid = u.DEFAULTDEPTID " +
            "WHERE strqrcode =? ";
        connection.query(sql, [strqrcode], (err, row) => {
            if (err) return next(err)
            res.send(row[0])
        })
    })
}

exports.findProfile = (req, res, next) => {
    // var username = parseInt(req.params.id)
    var username = req.params.id
    // console.log(strqrcode + ':test');
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "SELECT * FROM user WHERE  username= ? ";
        connection.query(sql, [username], (err, row) => {
            if (err) return next(err)
            res.send({ "status": "ok", "result": row[0] })
        })
    })
}

exports.findProfilePay = (req, res, next) => {
    // var username = parseInt(req.params.id)
    var username = req.params.id
    // console.log(strqrcode + ':test');
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "SELECT * FROM payment_alert WHERE username = ? ";
        connection.query(sql, [username], (err, row) => {
          
            if (err) return next(err)
            res.send({ "status": "ok", "result": row })
        })
    })
}


exports.findUser = (req, res, next) => {
    // var username = parseInt(req.params.id)

    var username = req.params.id
    // console.log(strqrcode + ':test');

    req.getConnection(function (err, connection) {
        connection.query(" SELECT username FROM user WHERE  username= ? ", [username], function (err, results) {
            if (err) return next(err)
            console.log(results[0])

            if (typeof results[0] !== 'undefined') {
                res.send({
                    status: 'Duplicate', "result": results[0]
                })
            } else {
                res.send({
                    status: 'ok', "result": ""

                })
            }


        })
    })


    // req.getConnection(function (err, connection)  {
    //     if (err) return next(err)
    //     var sql = "SELECT username FROM user WHERE  username= ? ";
    //     connection.query(sql, [username], function (err, row) {
    //         if (err) return next(err)
    //         console.log(row.lenght)
    //         res.send({"status":"ok","result":row[0]})
    //     })
    // })
}

exports.create = (req, res, next) => {
    var { body } = req
    var post = {
        user_type: body.user_type,
        name: body.name,
        username: body.username,
        password: body.password
    }
    req.getConnection(function (err, connection) {
        connection.query("select username from user where username=?", [post.username], function (err, results) {
            if (err) return next(err)
            if (results.lenght > 0) {
                res.send({
                    status: 201, message: 'username is Duplicate'

                })
            } else {
                connection.query("insert into user set ?", post, (err, results) => {
                    if (err) return next(err)
                    res.send({ status: 'ok', results })
                })
            }
        })
    })

}

exports.update = (req, res, next) => {
    var id = parseInt(req.params.id)
    var { body } = req

    var post = {
        user_type: body.user_type,
        name: body.name,
        username: body.username,
        password: body.password
    }

    req.getConnection(function (err, connection) {
        connection.query("update user set ? where id =?", [post, id], function (err, results) {
            if (err) return next(err)
            res.send({ status: 'ok', results })
        })
        // connection.query("select * from user where username=?", [post.username], function (err, results) {
        //     if (err) return next(err)
        //     var isUpdate = false;
        //     if (results.lenght > 0) {
        //         if (results[o].id !== id) {
        //             res.send({ status: 201, message: 'Username is Duplicate' })

        //         } else {
        //             isUpdate = true
        //         }
        //     } else {
        //         isUpdate = true
        //     }


        //     if (isUpdate) {
        //         connection.query("update user set ? where id =?", [post, id], function (err, results) {
        //             if (err) return next(err)
        //             res.send(results)
        //         })
        //     }
        // })
    })
}

exports.delete = (req, res, next) => {
    var id = parseInt(req.params.id)

    req.getConnection((err, connection) => {
        if (err) return next(err)
        connection.query("delete from user where id=?", [id], (err, results) => {
            if (err) return next(err)
            res.send(results)
        })

    })
}



//users success
exports.findHistory = (req, res, next) => {
    // var username = parseInt(req.params.id)
    var staff = req.params.id
    // console.log(strqrcode + ':test');
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = `SELECT a.id,a.post_date,start_date,end_date,price_start,price_current,topic,
                    if(i.image is null ,null,CONVERT(i.image USING utf8)) AS timage,staff_bid
                    FROM amulet a
                    LEFT JOIN amulet_image  i ON i.amulet_id = a.id
                    WHERE staff = ?
                    GROUP BY a.id 
                    ORDER BY post_date desc `;
        connection.query(sql, [staff], (err, row) => {
            if (err) return next(err)
            res.send(row)
        })
    })
}
exports.findUserStaff = (req, res, next) => {
    // var username = parseInt(req.params.id)
    var staff = req.params.id
    // console.log(strqrcode + ':test');
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = `SELECT u.username,tname,email,tel,facebook,p.changwatname,YEAR(CURDATE())-YEAR(u.birthday) AS tage
                    FROM user u
                    LEFT JOIN province p ON p.changwatcode = u.province
                    WHERE username= ? `;
        connection.query(sql, [staff], (err, row) => {
            if (err) return next(err)
            res.send(row)
        })
    })
}
exports.findPostCount = (req, res, next) => {
    // var username = parseInt(req.params.id)
    var staff = req.params.id
    // console.log(strqrcode + ':test');
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = `SELECT COUNT(id) AS tcount FROM amulet WHERE staff = ?`;
        connection.query(sql, [staff], (err, row) => {
            if (err) return next(err)
            res.send(row[0])
        })
    })
}
exports.findAuctionCount = (req, res, next) => {
    // var username = parseInt(req.params.id)
    var staff = req.params.id
    // console.log(strqrcode + ':test');
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = `SELECT COUNT(id) AS tcount FROM amulet WHERE staff_close = ?`;
        connection.query(sql, [staff], (err, row) => {
            if (err) return next(err)
            res.send(row[0])
        })
    })
}

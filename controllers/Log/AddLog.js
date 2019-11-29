var moment = require('moment');

exports.create = (req, res, next) => {
    var { body } = req
    var post = {
        id: null,
        username: body.username,
        status: body.status,
        hn:body.hn,
        d_update: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
    }
    req.getConnection(function (err, connection) {

        connection.query("insert into log_add set ?", post, (err, results) => {
            if (err) return next(err)
            res.send({ status: 'ok', results })
        })


    })

}
const moment = require('moment')

exports.findAll = (req, res, next) => {
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "SELECT * FROM users ";
        // var params = "%" + req.query.term + "%"
        connection.query(sql, (err, results) => {
            if (err) return next(err)
            res.send(results)
        })
    })
}

exports.create = (req, res, next) => {
    let { body } = req
    
    let post = {
        cid: body.cid,
        username: body.username,
        password: body.password,
        tname: body.tname,
        sex: body.sex,
        birthday: body.birth,
        email: body.email,
        book_bank: body.book_bank,
        book_bank_image: body.book_bank_image,
        cid_image: body.cid_image,
        reg_home_image: body.reg_home_image,
        package: body.package,
        address: body.address,
        tel: body.tel,
        facebook: body.facebook,
        province: body.province,
        bank_type: body.bank_type,
        bank_type_2: body.bank_type_2,
        register_date: moment().format('YYYY-MM-DD') + ' ' + moment().format('HH:mm:ss')

    }

    req.getConnection(function (err, connection) {

        connection.query("select cid from user where username=?", [post.username], function (err, results) {
            // if (err) return next(err)
            let usersRows = JSON.stringify(results);
            // console.log(usersRows)
            // console.log(parseInt(usersRows.length))
            if (parseInt(usersRows.length) > 2) {
                console.log('dup')
                res.send({
                    status: 201, message: 'เลขบัตร 13 หลัก is Duplicate'

                })
            } else {
                console.log('no')
                connection.query("insert into user set ?", post, (err, results) => {
                    if (err) return console.log(err)
                    res.send({ status: 'ok', results })
                })
            }
        })
    })

}

exports.province = (req, res, next) => {
    let id = req.params.id
    if(id==='undefined'){ id=''}
    //  console.log(id)
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "SELECT * FROM province where changwatname like CONCAT('%', ?,  '%') ";
        // var params = "%" + req.query.term + "%"
        connection.query(sql, [id], (err, results) => {
            if (err) return next(err)
            res.send(results)
        })
    })
}

exports.update = (req, res, next) => {
    let email = req.params.email


    let post = {
        confirm_email: 'Y',
    }

    req.getConnection(function (err, connection) {
        connection.query("update user set confirm_email='Y' where email =?", [email], function (err, results) {
            if (err) return next(err)
            res.send({ status: 'ok', results })
        })

    })
}
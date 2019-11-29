const PromiseFtp = require('promise-ftp');
var fs = require("fs")
exports.getPdf = async (req, res, next) => {
    let hn = req.params.hn

    let ftp = new PromiseFtp();

    try {
        await ftp.connect({ host: '110.49.126.23', user: 'scan1', password: '123456' });
        const stream = await ftp.get(`${hn}.pdf`);
        res.type('pdf');
        await new Promise((resolve, reject) => {
            res.on('finish', resolve);
            stream.once('error', reject);
            stream.pipe(res);
        });
    } catch (e) {
        // console.error(e);
    } finally {
        await ftp.end();
    }


}
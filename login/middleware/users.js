const jwt = require("jsonwebtoken");
module.exports = {
    validateRegister: (req, res, next) => {
        // username min length 3
        if (!req.body.username || req.body.username.length < 3) {
            return res.status(400).send({
                msg: 'Please enter a username with min. 3 chars'
            });
        }
        // password min 6 chars
        if (!req.body.password || req.body.password.length < 6) {
            return res.status(400).send({
                msg: 'Please enter a password with min. 6 chars'
            });
        }
        // password (repeat) does not match
        if (!req.body.password_repeat ||
            req.body.password != req.body.password_repeat
        ) {
            return res.status(400).send({
                msg: 'Both passwords must match'
            });
        }
        next();
    },
    isloggedin: (req, res, next) => {
        if (!req.headers.authorization) {
            return res.status(400).send({
                message: "Tu sesión no es valida"
            });
        }
        try {
            const autHeader = req.headers.authorization;
            const token = autHeader.split(' ')[1];
            const decode = jwt.verify(token, 'SECRETKEY');
            req.userData = decode;
            next();
        } catch (err) {
            throw err;
            return res.status(400).send({
                message: "Tu sesión no es valida"
            });
        }
    },
};
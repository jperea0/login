// routes/router.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');

const db = require('../lib/db.js');
const userMiddleware = require('../middleware/users.js');

router.post('/sign-up', userMiddleware.validateRegister, (req, res, next) => {
    db.query(`SELECT id FROM users WHERE LOWER(username) =LOWER(${req.body.username})`, (err, result) => {
        if (result && result.length) { //esto es para error
            return res.status(409).send({
                message: 'This username is alredy used',
            })
        } else { //esto es para usuario no estando en uso
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    throw err;
                    return err.status(500).send({
                        message: err,
                    })
                } else {
                    db.query(`INSERT INTO users (id, username, password, registered) VALUES ('${uuid.v4()}',
                    ${db.escape(req.body.username)},'${hash}', now())`,
                        (err, result) => {
                            if (err) {
                                throw err;
                                return res.status(400).send({
                                    message: err,
                                })
                            }
                            return res.status(201).send({
                                message: "registered",
                            });
                        })
                }
            })
        }
    })
});

router.post('/login', (req, res, next) => {
    db.query(`SELECT * FROM users WHERE username = ${db.escape(req.body.username)};`,
        (err, result) => {
            if (err) {
                throw err;
                return res.status(400).send({
                    message: err,
                });
            }
            if (!result.length) {
                return res.status(400).send({
                    message: "username incorrect"
                });
            }

            bcrypt.compare(req.body.password, result[0]['password'], (bErr, BResult) => {
                if (bErr) {
                    throw bErr;
                    return res.status(400).send({
                        message: "Username or Password incorrects"
                    });
                }
                if (BResult) { //password correcto
                    const token = jwt.sign({
                        username: result[0].username,
                        userid: result[0].id,
                    }, 'SECRETKEY', { expiresIn: "7d" });
                    db.query(`UPDATE users SET last_login = now() WHERE id='${result[0].id}';`);
                    return res.status(200).send({
                        message: "Logged in",
                        token,
                        user: result[0]
                    })
                }
                return res.status(400).send({
                    message: "Username or Password incorrects"
                })
            });
        })
});

router.get('/secret-route', userMiddleware.isloggedin, (req, res, next) => {
    console.log(req.userData)
    res.send('This is the secret content. Only logged in users can see that!');
});

module.exports = router;
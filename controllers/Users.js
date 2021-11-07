const db = require('../db');
var passwordHash = require('password-hash');
const { v4: uuidv4 } = require('uuid');
const jwt = require("jsonwebtoken")

const LoginUser = (request, response) => {
    let email = request.body.email;
    let pass = request.body.password;
    db.pool.query(`SELECT * FROM users WHERE email = $1`, [email], (error, results) => {
        if (error) {
            throw error
        }
        if (results.rowCount > 0) {
            let data = {
                id: results.rows[0].owner_id,
                username: results.rows[0].username,
                email: results.rows[0].email,
            }
            if (passwordHash.verify(pass, results.rows[0].password)) {
                let token = jwt.sign(data, 'rahasia');
                let decoded = jwt.verify(token, 'rahasia');
                response.status(200).json({
                    status: true,
                    message: "login success !",
                    data: data,
                    token: token,
                    hasiltoke: decoded.id

                })
            } else {
                response.status(201).json({
                    status: false,
                    message: 'email & password not valid !'
                })
            }

        } else {
            response.status(201).json('email & password not valid !')
        }

    })
}



const RegistrasiUser = (request, response) => {

    let username = request.body.username;
    let email = request.body.email;
    let password = passwordHash.generate(request.body.password);
    db.pool.query(`INSERT INTO users (owner_id,username,email,password) VALUES ('${uuidv4()}','${username}','${email}','${password}')`, (error, results) => {
        if (error) {
            throw error
        }
        response.status(201).send({
            message: 'Registrasi success !',
            status: true
        })

    })
}




function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    console.log(authHeader)
    if (authHeader == null) return res.status(401).send({
        message: 'unAuthorization !',
        status: false
    })

    jwt.verify(authHeader, 'rahasia', (err, user) => {
        console.log(err)

        if (err) return res.sendStatus(403)

        req.user = user

        next()
    })
}



module.exports = {
    LoginUser,
    RegistrasiUser,
    authenticateToken
}
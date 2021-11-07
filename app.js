const express = require('express')
const app = express()
const route = require("express").Router()
const users = require('./controllers/Users')
const port = process.env.PORT || 3000;

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(route)

app.get('/', (req, res) => {
    res.send('reflections aplication final project hacktiv8')
})

app.post('/login', users.LoginUser)
app.post('/register', users.RegistrasiUser)


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
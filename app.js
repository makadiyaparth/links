const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose')

const dbConfig = require('./config/database.config')
mongoose.connect(dbConfig.url)
.then(() => {
    console.log('[INFO] Connected to database')
})

const app = express()

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.redirect('/links')
})

app.get('/add', (req, res) => {
    res.render('add')
})

require('./app/routes/link.routes.js')(app)

app.listen(3000, () => console.log('[INFO] Server started'))
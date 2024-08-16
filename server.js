// connects env to server.js
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// localhost port & imports
const port = 3000
const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

// turns passport-config.js into a function
const initializePassport = require('./passport-config')
initializePassport(
  passport,
  username => users.find(user => user.username === username),
  id => users.find(user => user.id === id)
)

// user login data
const users = []

// veiw engine and dirname
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/img'))

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

// web page renders
app.get('', checkAuthenticated, (req, res) => {
  res.render('login.ejs')
})

app.get('/menu', checkAuthenticated, (req, res) => {
  res.render('menu.ejs', {name: req.user.name})
})

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/menu',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get('/login', (req, res) => {
  res.render('Login.ejs')
})

app.get('/CardGame', (req, res) => {
  res.render('index.ejs')
})

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs')
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    users.push({
      id: Date.now().toString(),
      username: req.body.username,
      password: hashedPassword
    })
    res.redirect('/login')
  } catch {
    res.redirect('/register')
  }
  console.log(users)
})

// checks if user are authenticated
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

// checks if user are not authenticated
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/menu')
  }
  next()
}

// shows in console if port is active
app.listen(port, () => console.info(`Listening on port ${port}`));

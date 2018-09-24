require('dotenv').load();

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');

const app = express();

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 3600000 },
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());
app.set('view engine', 'ejs');
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

app.get('/', (req, res) => {
  res.render('landing');
});

app.get('/stuart', (req, res) => {
  req.session.requestedPath = req.originalUrl;
  if (req.session.userid !== process.env.ADMINU || req.session.password !== process.env.ADMINP) {
    req.flash('error', 'Please login');
    res.redirect('/login');
  } else {
    res.render('stuart');
  }
});

app.get('/alumini', (req, res) => {
  req.session.requestedPath = req.originalUrl;
  if (req.session.userid !== process.env.ADMINU || req.session.password !== process.env.ADMINP) {
    req.flash('error', 'Please login');
    res.redirect('/login');
  } else {
    res.render('alumini');
  }
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  if (req.body.userid !== process.env.ADMINU || req.body.password !== process.env.ADMINP) {
    req.flash('error', 'Incorrect Password');
    res.redirect('/login');
  } else {
    req.session.userid = req.body.userid;
    req.session.password = req.body.password;
    if (req.session.requestedPath) {
      res.redirect(req.session.requestedPath);
    } else {
      res.redirect('/');
    }
  }
});

app.listen(process.env.PORT, process.env.IP, () => {
  console.log('RTC map server starting.');
});
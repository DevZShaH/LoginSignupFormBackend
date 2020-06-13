const express = require('express');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();
const PORT = process.env.PORT || 5000;

//PASSPORT config
require('./config/passport')(passport);

//DB config
const db = require('./config/keys').MongoURI;

//Connect to MongoDB
mongoose
	.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log('MongoDB Connected...'))
	.catch((err) => console.log(err));

//EJS
app.set('view engine', 'ejs');
app.use(express.json()); // body-parser
app.use(express.static('public'));

//BodyParser
app.use(express.urlencoded({ extended: false }));

//EXPRESS SESSION
app.use(
	session({
		secret: 'secret',
		resave: true,
		saveUninitialized: true
	})
);

//PASSPORT MIDDLEWARE
app.use(passport.initialize());
app.use(passport.session());

//CONNECT FLASH
app.use(flash());

//GLOBAL VARIABLES
app.use((req, res, next) => {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	next();
});

//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

app.listen(PORT, console.log(`server running on port ${PORT}`));

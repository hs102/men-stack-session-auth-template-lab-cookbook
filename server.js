const dotenv = require('dotenv');

dotenv.config();
const express = require('express');

const app = express();

const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const MongoStore = require("connect-mongo");
const isSignedIn = require("./middleware/is-signed-in.js");
const passUserToView = require("./middleware/pass-user-to-view.js");

// Controllers
const authController = require('./controllers/auth.js');
const foodsController = require('./controllers/foods.js');
const usersController = require('./controllers/users.js');

// Set the port from environment variable or default to 3000
const port = process.env.PORT ? process.env.PORT : '3000';

// Allow a sensible local default if .env isn't set
const mongoUri = (process.env.MONGODB_URI && process.env.MONGODB_URI.trim())
  ? process.env.MONGODB_URI.trim()
  : 'mongodb://127.0.0.1:27017/cookbook';
if (!process.env.MONGODB_URI) {
  console.warn('MONGODB_URI not set in .env, defaulting to mongodb://127.0.0.1:27017/cookbook');
}

mongoose.connect(mongoUri);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// MIDDLEWARE
//
// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }));
// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride('_method'));
// Morgan for logging HTTP requests
app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: mongoUri,
    }),
  })
);
app.use(passUserToView);

// PUBLIC
app.get('/', (req, res) => {
  res.render('index.ejs');
});

app.use('/auth', authController);

// Community (public pages to browse users)
app.use('/users', usersController);

// PROTECTED pantry routes (must be after isSignedIn)
app.use(isSignedIn);
app.use('/users/:userId/foods', foodsController);

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});

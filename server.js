// importing packages
const express = require('express');
const methodOverride = require('method-override');
const dotenv = require('dotenv').config();
const morgan = require('morgan');
const session = require('express-session');

const app = express();
const connectToDB = require('./config/db');

// middleware
app.use(express.urlencoded({ extended: true}));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(session({
    secret: 'stackd_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        httpOnly: true
    }
}));
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

app.set('view engine', 'ejs');
app.use(express.json());

// connect to DB
connectToDB();

// routes
const userRoutes = require('./routes/user.routes');
const gameRoutes = require('./routes/game.routes');
const authRoutes = require('./routes/auth.routes');

app.use('/users', userRoutes);
app.use('/games', gameRoutes);
app.use('/auth', authRoutes);

// listening port
app.listen(process.env.PORT || 3000, () => {
  console.log('Server is running on port 3000');
});